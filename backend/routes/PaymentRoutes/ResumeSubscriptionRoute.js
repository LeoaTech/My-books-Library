const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe");
const { checkAuth } = require("../../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

router.use(checkAuth);

router.post("/", async (req, res) => {
  const userId = req.user?.user_id || req.user?.userId;
  const { userType, stripeAccountID } = req.body;

  try {
    let subscriptionId;
    let stripeAccountId = null;
    if (userType === "customer") {
      const subResult = await db.query(
        `SELECT subscription_id FROM subscriptions WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      subscriptionId = subResult.rows[0]?.subscription_id;
      stripeAccountId = stripeAccountID;

      if (!stripeAccountId) {
        return res.status(400).json({
          error: "Stripe account ID is required for library customer subscriptions.",
        });
      }
    } else {
      const subResult = await db.query(
        `SELECT stripe_subscription_id FROM client_subscription WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      subscriptionId = subResult.rows[0]?.stripe_subscription_id;
    }

    if (!subscriptionId) {
      return res
        .status(404)
        .json({ error: "No subscription ID found to resume." });
    }

    if (stripeAccountId) {
      // Library customer - resume on connected account
      await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: false,
        },
        {
          stripeAccount: stripeAccountId,
        }
      );
    } else {
      // saas client - resume on platform account
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    }

    res.json({ message: "Subscription resumed successfully." });
  } catch (error) {
    console.error("Resume Subscription Error:", error);
    res.status(500).json({
      error: "Failed to resume subscription",
    });
  }
});

module.exports = router;
