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
const createStripePriceAndPaymentLink = async (
  stripe,
  price,
  duration,
  credits,
  stripeProductId,
  subdomain
) => {
  const priceInCents = convertPriceToCents(price);
  const { interval, interval_count } = getStripeInterval(duration);
  const durationLabel = duration === 30 ? "monthly" : "yearly";

  // 1. Create Stripe Price
  const stripePrice = await stripe.prices.create({
    unit_amount: priceInCents,
    currency: "pkr",
    recurring: {
      interval: interval,
      interval_count: interval_count,
    },
    product: stripeProductId,
    metadata: {
      duration_days: duration,
      credits_allocated: credits,
      billing_period: durationLabel,
    },
  });
  const stripePriceId = stripePrice.id;
  console.log(`Stripe ${durationLabel} Price Created: ${stripePriceId}`);

  // 2. Create Payment Link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: stripePriceId, quantity: 1 }],
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${LIBRARY_URL}/${subdomain}/success?session_id={CHECKOUT_SESSION_ID}`,
      },
    },
    metadata: {
      product_id: stripeProductId,
      price_id: stripePriceId,
      billing_period: durationLabel,
    },
  });

  return {
    price_id: stripePriceId,
    payment_link: paymentLink.url,
    price_value: price,
    duration_days: duration,
    credits_allocated: credits,
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

/* Create New Single Pricing Plan*/

const CreatePlan = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }

  if (!req.body) {
    return res.status(400).json("Invalid Pricing Details");
  }

  const getSubdomain = await db.query(
    "SELECT subdomain FROM entities WHERE id = $1",
    [entityId]
  );

  const subdomain = getSubdomain?.rows[0]?.subdomain;

  let stripeProductId = null;
  let stripePriceId = null;
  let stripePaymentLink = null;

  try {
    const { plan_name, price, duration, credits_allocated, features } =
      req.body;

    // Create Stripe Product
    const product = await stripe.products.create({
      name: plan_name,
      description: `Credits: ${credits_allocated}. Features: ${features.join(
        ", "
      )}`,
      metadata: {
        entityId: entityId,
        credits_allocated: credits_allocated,
      },
    });
    stripeProductId = product.id;
    console.log(`Stripe Product Created: ${stripeProductId}`);

    // Create Stripe Price
    const priceInCents = convertPriceToCents(price);
    const { interval, interval_count } = getStripeInterval(duration);

    const stripePrice = await stripe.prices.create({
      unit_amount: priceInCents,
      currency: "pkr",
      recurring: {
        interval: interval,
        interval_count: interval_count,
      },
      product: stripeProductId,
      metadata: {
        duration_days: duration,
      },
    });
    stripePriceId = stripePrice.id;
    console.log(`Stripe Price Created: ${stripePriceId}`);

    // Create Payment Link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: stripePriceId, quantity: 1 }],
      after_completion: {
        type: "redirect",
        redirect: {
          url: `http://localhost:5173/${subdomain}/success?session_id={CHECKOUT_SESSION_ID}`,
        },
      },
    });
    stripePaymentLink = paymentLink.url;
    console.log(`Stripe Payment Link Created: ${stripePaymentLink}`);

    const jsonFeatures = JSON.stringify(features);
    const createPricinguery = await db.query(
      `INSERT INTO membership_plan (plan_name, price, duration, credits_allocated, features,entity_id) VALUES ($1,$2,$3, $4,$5, $6) RETURNING plan_id,plan_name`,
      [plan_name, price, duration, credits_allocated, jsonFeatures, entityId]
    );

    res.status(200).json({
      pricing: createPricinguery?.rows[0],
      message: "Pricing plan Saved Successfully ",
    });
  } catch (error) {
    console.log(error, "Error creating new pricing plan");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Pricing",
    });
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
  // console.log(subdomain, "Subdomain found");

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
    } = req.body;

    // Create Stripe Product
    const product = await stripe.products.create({
      name: plan_name,
      description: `Features: ${features.join(", ")}`,
      metadata: {
        entityId: entityId,
        subdomain: subdomain,
      },
    });
    stripeProductId = product.id;
    console.log(`Stripe Product Created: ${stripeProductId}`);

    // Create Monthly price and payment Link
    const monthlyData = await createStripePriceAndPaymentLink(
      stripe,
      monthly_price,
      monthly_duration, // 30 days in a month
      monthly_credits_allocated,
      stripeProductId,
      subdomain
    );

    //Create Yearly Price and  Payment Link
    const yearlyData = await createStripePriceAndPaymentLink(
      stripe,
      yearly_price,
      yearly_duration, // 365 days in a year
      yearly_credits_allocated,
      stripeProductId,
      subdomain
    );

    const planDetails = {
      product_id: stripeProductId,
      monthly: monthlyData,
      yearly: yearlyData,
      features: features,
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
    console.log(error, "Error creating new pricing plan");
    res.status(500).json({
      error,
      message: error.message || "Error Creating Pricing",
    });
  }
});

const UpdatePlan = asyncHandler(async (req, res) => {
  // console.log(req.body, req.params);

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

    const { plan_name, price, duration, credits_allocated, features } =
      req.body;

    const jsonFeatures = JSON.stringify(features);
    const updatePricingQuery = await db.query(
      `UPDATE membership_plan SET plan_name=$1, price=$2, duration =$3, credits_allocated=$4, features=$5 WHERE entity_id=$6 AND plan_id=$7 RETURNING plan_id,plan_name`,
      [
        plan_name,
        price,
        duration,
        credits_allocated,
        jsonFeatures,
        entityId,
        plan_id,
      ]
    );

    // console.log(updatePricingQuery?.rows[0], "Pricing Plan Updated");

    res.status(200).json({
      pricing: updatePricingQuery?.rows[0],
      message: "Pricing Plan Updated Successfully ",
    });
  } catch (error) {
    console.log(error, "Error Updating pricing Plans");
    res.status(500).json({
      error,
      message: error.message || "Error Updating Pricing Plan",
    });
  }
});

const DeletePlan = asyncHandler(async (req, res) => {
  // console.log(req.params);

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
      return res.status(400).json({ message: "Missing! Stripe Product ID not exists" });
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
          console.warn(
            `Stripe prevented deletion of Product ${stripeProductId}. Plan is likely in use.`
          );

          return res.status(409).json({
            message:
              "Cannot delete plan. It has active subscriptions, payment links, or historical data on Stripe. Please contact support to archive the product instead.",
            details: stripeError.message,
          });
        }
        console.error(`Unhandled Stripe Error during deletion: ${stripeError}`);
        throw stripeError;
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

module.exports = {
  FetchPricingPlans,
  CreatePlan,
  DeletePlan,
  UpdatePlan,
  CreateDualPlan,
};
