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


module.exports = { FetchPricingPlans };
