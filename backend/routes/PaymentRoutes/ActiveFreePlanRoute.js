const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.use(checkAuth);
router.post("/", async (req, res) => {
  const { userId } = req.user; //
  const { planName } = req.body; // "Free" 

  if (!["Free", "School"].includes(planName)) {
    return res.status(400).json({ error: "Invalid plan name." });
  }

  try {
    const findClientId = await db.query(
      `SELECT id,subscription_id, current_period_end from client_subscription WHERE user_id =$1 and status =$2`,
      [userId, "active"]
    );

    if (findClientId.rows.length > 0) {
      const activeSubscription = findClientId.rows[0];

      if (activeSubscription && activeSubscription?.subscription_id != "") {
        console.log(
          `Cancelling existing Stripe subscription: ${activeSubscription?.subscription_id}`
        );

        // Call Stripe API to cancel subscriptin . by default, it cancels at period end.
        const cancelledSub = await stripe.subscriptions.cancel(
          activeSubscription?.subscription_id
        );

        await db.query(
          `UPDATE client_subscription SET
          status =$1,subscription_valid_until =$2, auto_renew = $3 WHERE id =$2 AND user_id =$3`,
          [
            "cancelled",
            new Date(cancelledSub?.cancel_at * 1000)|| activeSubscription.current_period_end,
            false,
            activeSubscription.id,
            userId,
          ]
        );       

        res.status(200).json({
          message: `Subscription cancelled successfully. Free Plan will be active at the current subscription period end.`,
        });
      }
    } else {
      const FreePlan = {
        planName: "Free",
        status: "active", // The free plan is active
        accessUntil: null,
        renewsOn: null,
      };

      res.status(200).json({
        plan: FreePlan,
        message: `${FreePlan?.planName} plan activated successfully.`,
      });
    }
  } catch (error) {
    console.error("Failed to activate free plan in DB:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
