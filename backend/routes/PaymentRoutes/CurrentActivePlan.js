const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.use(checkAuth);

async function getPlanNameFromPriceId(priceId) {

  if (!priceId) {
    throw new Error("Price ID is undefined, cannot fetch plan details.");
  }

  const price = await stripe.prices.retrieve(priceId, {
    expand: ["product"],
  });
  // console.log(price, "Price");

  const product = price.product;
  // console.log(product, "Product Plan");

  return product.name || undefined;
}

router.get("/", async (req, res) => {
  console.log(req.user);

  const { userId } = req.user;

  const paidSubscription = await db.query(
    `SELECT 
         stripe_price_id, 
         subscription_valid_until, 
         current_period_end, 
         status 
       FROM 
         client_subscription 
       WHERE 
         user_id = $1 AND status = ANY($2)`,
    [userId, ["active", "pending_cancellation"]]
  );

  console.log(paidSubscription.rows, "Paid Subscriptions");
   
  // If a paid subscription exists.
  if (paidSubscription.rows.length > 0) {
    //get the plan name using the stripe_product_id
    const planName = await getPlanNameFromPriceId(
      paidSubscription?.rows[0].stripe_price_id
    );
    console.log(planName, "Plan Name");

    res.json({
      plan: {
        planName: planName,
        status: paidSubscription.status, // "active" , "pending_cancellation"
        accessUntil: paidSubscription.subscription_valid_until,
        renewsOn: paidSubscription.current_period_end,
      },
    });
  } else {
    //  If no active or pending_cancellation subscription is found, then user is on the Free plan.
    res.json({
      plan: {
        planName: "Free",
        status: "active", // The free plan is active
        accessUntil: null,
        renewsOn: null,
      },
    });
  }
});
module.exports = router;
