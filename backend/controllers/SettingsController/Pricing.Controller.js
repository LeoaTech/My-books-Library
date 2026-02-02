const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");
const {
  getStripeInterval,
  convertPriceToCents,
} = require("../../utils/stripe.js");

require("dotenv").config();

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY // Test Key
);

const LIBRARY_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Create a Stripe Product price & Payment Link
const createStripePriceId = async (
  stripe,
  price,
  duration,
  credits,
  stripeProductId,
  stripe_account_id,
  currency = "pkr"
) => {
  const priceInCents = convertPriceToCents(price);
  const { interval, interval_count } = getStripeInterval(duration);
  const durationLabel = duration === 30 ? "monthly" : "yearly";

  // 1. Create Stripe Price
  const stripePrice = await stripe.prices.create(
    {
      unit_amount: priceInCents,
      currency: currency,
      recurring: {
        interval: interval,
        interval_count: interval_count,
      },
      product: stripeProductId,
      metadata: {
        user_type: "customer",
        duration_days: duration,
        credits_allocated: credits,
        billing_period: durationLabel,
      },
    },
    {
      stripeAccount: stripe_account_id, //https://docs.stripe.com/connect/authentication
    }
  );
  const stripePriceId = stripePrice.id;
  // console.log(`Stripe ${durationLabel} Price Created: ${stripePriceId}`);

  return {
    price_id: stripePriceId,
    price_value: price,
    duration_days: duration,
    credits_allocated: credits,
    currency: currency,
  };
};

/* Get ALL Pricing */
const FetchPricingPlans = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const PricingQuery = `SELECT plan_id,stripe_product_id, plan_name,plan_details FROM membership_plan WHERE entity_id =$1`;
    const getAllPricing = await db.query(PricingQuery, [entityId]);

    res.status(200).json({
      plans: getAllPricing?.rows,
      message: "Pricing plans Retrieved Successfully! ",
    });
  } catch (error) {
    console.log(error);
  }
});



/* Created a Dual Pricing Plan */
const CreateDualPlan = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }

  if (!req.body) {
    return res.status(400).json("Invalid Pricing Details");
  }

  // Get the Subdomain for the Entity ID to generate a redirect after payment Link
  const getSubdomain = await db.query(
    "SELECT subdomain FROM entities WHERE id = $1",
    [entityId]
  );

  const subdomain = getSubdomain?.rows[0]?.subdomain;
  console.log(req.body, "Create dual Plan Payload");

  let stripeProductId = null;

  try {
    const {
      plan_name,
      monthly_price,
      yearly_price,
      monthly_duration,
      yearly_duration,
      monthly_credits_allocated,
      yearly_credits_allocated,
      features,
      stripe_account_id,
      currency,
    } = req.body;

    // Create Stripe Product
    const product = await stripe.products.create(
      {
        name: plan_name,
        description: `Features: ${features.join(", ")}`,
        metadata: {
          entityId: entityId,
          subdomain: subdomain,
        },
      },
      {
        stripeAccount: stripe_account_id, //https://docs.stripe.com/connect/authentication
      }
    );
    stripeProductId = product.id;
    console.log(`Stripe Product Created: ${stripeProductId}`);

    // Create Monthly price
    const monthlyData = await createStripePriceId(
      stripe,
      monthly_price,
      monthly_duration, // 30 days in a month
      monthly_credits_allocated,
      stripeProductId,
      stripe_account_id,
      currency
    );

    //Create Yearly Price
    const yearlyData = await createStripePriceId(
      stripe,
      yearly_price,
      yearly_duration, // 365 days in a year
      yearly_credits_allocated,
      stripeProductId,
      stripe_account_id,
      currency
    );

    const planDetails = {
      product_id: stripeProductId,
      monthly: monthlyData,
      yearly: yearlyData,
      features: features,
      stripe_account_id,
    };

    const jsonPlanDetails = JSON.stringify(planDetails);

    // Now add the Product ,Prices and Plan Name in db
    const createPricinguery = await db.query(
      `INSERT INTO membership_plan (plan_name, plan_details, stripe_product_id,entity_id) VALUES ($1,$2,$3, $4) RETURNING plan_id,plan_name, stripe_product_id, plan_details`,
      [plan_name, jsonPlanDetails, stripeProductId, entityId]
    );

    // console.log(createPricinguery?.rows[0], "Pricing plan Saved");

    res.status(200).json({
      pricing: createPricinguery?.rows[0],
      message: "Pricing plan Saved Successfully ",
    });
  } catch (error) {
    // console.log(error, "Error creating new pricing plan");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Pricing",
    });
  }
});

const UpdatePlan = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }

  try {
    if (!req.body) {
      return res.status(400).json("Invalid Pricing plan Details");
    }

    if (!req.params.plan_id) {
      return res.status(400).json({
        message: "Invalid plan ID",
      });
    }
    const { plan_id } = req.params;

    const existingPlanQuery = await db.query(
      "SELECT plan_details, stripe_product_id FROM membership_plan WHERE entity_id=$1 AND plan_id=$2",
      [entityId, plan_id]
    );

    if (existingPlanQuery.rowCount === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const currentPlanDetails = existingPlanQuery.rows[0].plan_details;
    const stripeAccountId = currentPlanDetails.stripe_account_id;

    const {
      plan_name,
      features,
      isMonthlyPriceChanged,
      monthlyUpdate,
      isYearlyPriceChanged,
      yearlyUpdate,
    } = req.body;

    // 1. Update Stripe Product Details (Name, Features & Metadata )
    if (existingPlanQuery.rows[0].stripe_product_id) {
      await stripe.products.update(
        existingPlanQuery.rows[0].stripe_product_id,
        {
          name: plan_name,
          description: `Features: ${features.join(", ")}`,
        },
        {
          stripeAccount: stripeAccountId,
        }
      );
    }

    let newMonthlyData = currentPlanDetails.monthly;
    let newYearlyData = currentPlanDetails.yearly;

    //  Monthly Price Change
    if (isMonthlyPriceChanged && monthlyUpdate) {
      // Archive old price
      if (monthlyUpdate.monthly_old_price_id) {
        try {
          await stripe.prices.update(
            monthlyUpdate.monthly_old_price_id,
            { active: false },
            { stripeAccount: stripeAccountId }
          );
        } catch (err) {
          console.warn("Failed to archive old monthly price:", err.message);
        }
      }

      // then Create new price
      newMonthlyData = await createStripePriceId(
        stripe,
        monthlyUpdate.monthly_price,
        30, // monthly duration
        monthlyUpdate.monthly_credits_allocated,
        existingPlanQuery.rows[0].stripe_product_id,
        stripeAccountId
      );
    }

    // Yearly Price Change
    if (isYearlyPriceChanged && yearlyUpdate) {
      if (yearlyUpdate.yearly_old_price_id) {
        try {
          await stripe.prices.update(
            yearlyUpdate.yearly_old_price_id,
            { active: false },
            { stripeAccount: stripeAccountId }
          );
        } catch (err) {
          console.warn("Failed to archive old yearly price:", err.message);
        }
      }

      newYearlyData = await createStripePriceId(
        stripe,
        yearlyUpdate.yearly_price,
        365, // yearly duration
        yearlyUpdate.yearly_credits_allocated,
        existingPlanQuery.rows[0].stripe_product_id,
        stripeAccountId
      );
    }

    const updatedPlanDetails = {
      ...currentPlanDetails,
      monthly: newMonthlyData,
      yearly: newYearlyData,
      features: features,
    };

    const jsonPlanDetails = JSON.stringify(updatedPlanDetails);

    // Update DB
    const updatePricingQuery = await db.query(
      `UPDATE membership_plan SET plan_name=$1, plan_details=$2 WHERE entity_id=$3 AND plan_id=$4 RETURNING *`,
      [plan_name, jsonPlanDetails, entityId, plan_id]
    );

    res.status(200).json({
      pricing: updatePricingQuery?.rows[0],
      message: "Pricing Plan Updated Successfully",
    });
  } catch (error) {
    console.log(error, "Error Updating pricing Plans");
    res.status(500).json({
      error,
      message: error.message || "Error Updating Pricing Plan",
    });
  }
});

/* Delete Stripe product/Pricing plan  */
const DeletePlan = asyncHandler(async (req, res) => {

  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  if (!req?.params?.plan_id) {
    return res.status(400).json("Missing Pricing plan ID");
  }
  try {
    const { plan_id } = req.params;

    // Get the Stripe Product ID that needs to delete
    const ProductId = await db.query(
      `SELECT stripe_product_id from membership_plan WHERE plan_id =$1 AND entity_id=$2 `,
      [plan_id, entityId]
    );

    const stripeProductId = ProductId.rows[0]?.stripe_product_id;
    if (!stripeProductId) {
      return res
        .status(400)
        .json({ message: "Missing! Stripe Product ID not exists" });
    } else {
      try {
        // Delete the Product from Stripe
        await stripe.products.del(stripeProductId);
        console.log(`Stripe Product Deleted: ${stripeProductId}`);
      } catch (stripeError) {
        // throw error if a product/price is linked to an active subscription or payment link.
        if (
          stripeError.type === "StripeInvalidRequestError" ||
          stripeError.code === "resource_missing"
        ) {
          if (stripeError.code === "resource_missing") {
             console.log("Product already deleted from Stripe");
          } else {
             console.log("Product has linked resources, archiving instead...");
             try {
                await stripe.products.update(stripeProductId, { active: false });
                console.log(`Stripe Product Archived: ${stripeProductId}`);
             } catch (archiveError) {
                console.error(`Failed to archive product: ${archiveError.message}. Please Contact Support`);
                throw archiveError; 
             }
          }
        } else {
             console.error(`Unhandled Stripe Error during deletion: ${stripeError}`);
             throw stripeError;
        }
      }
    }

    const deletePricingQuery = await db.query(
      `DELETE FROM membership_plan WHERE entity_id=$1 AND plan_id=$2 RETURNING plan_id`,
      [entityId, plan_id]
    );

    // console.log(deletePricingQuery?.rows[0], "Pricing Plan Deleted");

    res.status(200).json({
      message: "Pricing Plan Deleted Successfully ",
    });
  } catch (error) {
    console.log(error, "Error Deleting pricing plan");
    res.status(500).json({
      error,
      message: error.message || "Error Deleting Pricing Plan",
    });
  }
});

/* Update Sorting Order of Plans */
const UpdateSortingOrder = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }

  if (!req.body.sortData || !Array.isArray(req.body.sortData)) {
    return res.status(400).json({ message: "Invalid sort data" });
  }

  try {
    const { sortData } = req.body; 

    // Update each plan's sorting_number in plan_details JSON
    for (const item of sortData) {
      const { plan_id, sorting_number } = item;

      // Fetch current plan_details
      const planQuery = await db.query(
        "SELECT plan_details FROM membership_plan WHERE plan_id = $1 AND entity_id = $2",
        [plan_id, entityId]
      );

      if (planQuery.rowCount === 0) {
        continue; 
      }

      const currentDetails = planQuery.rows[0].plan_details;
      // add sorting number for plan id 
      const updatedDetails = {
        ...currentDetails,
        sorting_number: sorting_number,
      };

      // Update the sorting order in plan_details in DB
      await db.query(
        "UPDATE membership_plan SET plan_details = $1 WHERE plan_id = $2 AND entity_id = $3",
        [JSON.stringify(updatedDetails), plan_id, entityId]
      );
    }

    res.status(200).json({
      message: "Pricing plan order updated successfully",
    });
  } catch (error) {
    console.log(error, "Error updating pricing plan order");
    res.status(500).json({
      error,
      message: error.message || "Error updating pricing plan order",
    });
  }
});

module.exports = {
  FetchPricingPlans,
  DeletePlan,
  UpdatePlan,
  CreateDualPlan,
  UpdateSortingOrder,
};
