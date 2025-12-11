const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.use(checkAuth);
router.post("/", async (req, res) => {
  const { userId, entityId } = req.user; 
  const { newPriceId, planName } = req.body; 
  console.log(req.body, "Body");
  if (!newPriceId) {
    return res.status(400).json({ error: "newPriceId is required." });
  }
  try {
    const subResult = await db.query(
      `SELECT stripe_subscription_id FROM client_subscription WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    const subscriptionId = subResult.rows[0]?.stripe_subscription_id;

    if (!subscriptionId) {
      return res
        .status(404)
        .json({ error: "No active subscription found to change." });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log(subscription, "Subscription retrieved");

    const currentItemId = subscription.items.data[0].id;

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: currentItemId,
            price: newPriceId,
          },
        ],
        metadata: {
          entityId,
          user_type: "client",
          app_client_id: userId,
          planName: planName,
        },
        proration_behavior: "create_prorations", 
        cancel_at_period_end: false,
      }
    );

    console.log(updatedSubscription, "Changed Plan Successfully");

    res.json({ message: "Subscription plan changed successfully." });
  } catch (error) {
    console.error("Stripe plan change failed:", error);
    res.status(500).json({ error: "Could not change subscription plan." });
  }
});

module.exports = router;
