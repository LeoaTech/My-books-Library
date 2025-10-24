const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.use(checkAuth);
router.post("/", async (req, res) => {
  const { userId } = req.user; //

  try {
    const subResult = await db.query(
      `SELECT stripe_subscription_id FROM client_subscription WHERE user_id = $1 AND status = $2`,
      [userId,'active']
    );
    console.log(subResult, "SubResult in Cancel Subscription");
    
    const subscriptionId = subResult.rows[0]?.stripe_subscription_id;

    if (!subscriptionId) {
      return res
        .status(404)
        .json({ error: "No active subscription to cancel." });
    }
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    res.json({ message: "Subscription Cancellation Scheduled" });
  } catch (error) {
    console.error("Cancellation Error:", error);
    res.status(500).json({
      error: "Failed to create cancellation request for subscription",
    });
  }
});

module.exports = router;
