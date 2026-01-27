const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.use(checkAuth);
router.post("/", async (req, res) => {
  const userId = req.user?.user_id || req.user?.userId;
  const entityId = req.user?.entityId || req.user?.entity_id;
  const { newPriceId, planName } = req.body;
  // console.log(req.body, "Body");

  const userType = req.body?.userType || "client";
  const stripeAccountID = req?.body?.stripeAccountID || null;

  if (!newPriceId) {
    return res.status(400).json({ error: "New PriceId is required." });
  }

  try {
    let subscriptionId;
    let stripeAccountId = null;

    if (userType === "customer") {
      // Library customer - get subscription_id from subscriptions table
      const subResult = await db.query(
        `SELECT subscription_id FROM subscriptions WHERE user_id = $1 AND status = 'active'`,
        [userId],
      );

      subscriptionId = subResult.rows[0]?.subscription_id;
      stripeAccountId = stripeAccountID;

      if (!stripeAccountId) {
        return res.status(400).json({
          error:
            "Stripe account ID is required for library customer subscriptions.",
        });
      }
    } else {
      // saas client - get stripe_subscription_id from client_subscription table
      const subResult = await db.query(
        `SELECT stripe_subscription_id FROM client_subscription WHERE user_id = $1 AND status = 'active'`,
        [userId],
      );

      subscriptionId = subResult?.rows?.[0]?.stripe_subscription_id;
    }

    if (!subscriptionId) {
      return res
        .status(404)
        .json({ error: "No active subscription found to change." });
    }

    // get subscription from the Stripe account (connected or platform) based on userType
    const subscription = stripeAccountId
      ? await stripe.subscriptions.retrieve(subscriptionId, {
          stripeAccount: stripeAccountId,
        })
      : await stripe.subscriptions.retrieve(subscriptionId);


    const currentItemId = subscription.items.data[0].id;

    // Update subscription on the Stripe account (connected or platform) based on userType
    const updateOptions = {
      items: [
        {
          id: currentItemId,
          price: newPriceId,
        },
      ],
      metadata: {
        entityId,
        user_type: userType || "client",
        app_client_id: userId,
        planName: planName,
      },
      proration_behavior: "create_prorations",
      cancel_at_period_end: false,
    };

    const updatedSubscription = stripeAccountId
      ? await stripe.subscriptions.update(subscriptionId, updateOptions, {
          stripeAccount: stripeAccountId,
        })
      : await stripe.subscriptions.update(subscriptionId, updateOptions);

    // console.log(updatedSubscription, "Changed Plan Successfully");

    res.json({ message: "Subscription plan changed successfully." });
  } catch (error) {
    console.error("Stripe plan change failed:", error);
    res.status(500).json({ error: "Failed to change subscription plan." });
  }
});

module.exports = router;
