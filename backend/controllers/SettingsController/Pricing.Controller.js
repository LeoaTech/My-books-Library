const asyncHandler = require("express-async-handler");
const db = require("../../config/dbConfig");

/* Get ALL Pricing */
const FetchPricingPlans = asyncHandler(async (req, res) => {
  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    const PricingQuery = `SELECT plan_id, plan_name, price, duration, credits_allocated, features FROM membership_plan WHERE entity_id =$1`;
    const getAllPricing = await db.query(PricingQuery, [entityId]);

    res.status(200).json({
      plans: getAllPricing?.rows,
      message: "Pricing plans Retrieved Successfully! ",
    });
  } catch (error) {
    console.log(error);
  }
});

/* Create New Pricing Plan*/

const CreatePlan = asyncHandler(async (req, res) => {
  console.log(req.body);

  const entityId = req?.user?.entityId || req?.user?.entity_id;

  if (!entityId) {
    return res.status(403).json("Invalid Request, No Library ID provided");
  }
  try {
    if (!req.body) {
      return res.status(400).json("Invalid Pricing Details");
    }

    const { plan_name, price, duration, credits_allocated, features } =
      req.body;

    const jsonFeatures = JSON.stringify(features);
    const createPricinguery = await db.query(
      `INSERT INTO membership_plan (plan_name, price, duration, credits_allocated, features,entity_id) VALUES ($1,$2,$3, $4,$5, $6) RETURNING plan_id,plan_name`,
      [plan_name, price, duration, credits_allocated, jsonFeatures, entityId]
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
  console.log(req.body, req.params);

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





module.exports = { FetchPricingPlans,CreatePlan , UpdatePlan};
