const stripe = require("../../config/stripe");
const { checkAuth } = require("../../middleware/authMiddleware");

const express = requre("express");

const router = express.Router();

router.use(checkAuth);

router.post("/resume-subscription", async (req, res) => {
  const { userId } = req.user; //

  try {
    const subResult = await db.query(
      `SELECT stripe_subscription_id FROM client_subscription WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    const subscriptionId = subResult.rows[0]?.stripe_subscription_id;

    if (!subscriptionId) {
      return res
        .status(404)
        .json({ error: "No subscription ID found to resume." });
    }
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });

    res.json({ message: "Subscription resumed successfully." });
  } catch (error) {
    // ... error handling ...
  }
});

module.exports = router;
