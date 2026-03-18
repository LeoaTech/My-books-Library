const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");
const {
  totalBooks,
  totalUsers,
} = require("../../controllers/dashboardController/DashboardController.js");
const router = express.Router();

router.use(checkAuth);

async function getPlanDetailsFromPriceId(priceId) {
  if (!priceId) {
    throw new Error("Price ID is undefined, cannot fetch plan details.");
  }

  const price = await stripe?.prices?.retrieve(priceId, {
    expand: ["product"],
  });

  const product = price?.product;
  return {
    name: product?.name || undefined,
    amount: price?.unit_amount ? price.unit_amount / 100 : 0,
    currency: price?.currency || "usd",
  };
}

//Get Current Plan:
router.get("/", async (req, res) => {
  const user = req.user;

  const userId = user?.user_id || user?.userId;
  const entityId = user?.entityId || user?.entity_id;
  let userType;
  try {
    const subscriptionResult = await db.query(
      `SELECT 
        stripe_subscription_id,
        status,
        current_period_end,
        stripe_price_id,
        cancel_at_period_end,
        'client' as user_type,
        null as plan_id
       FROM client_subscription
       WHERE user_id = $1 AND status IN ('active', 'past_due')
       
       UNION ALL
       
       SELECT 
        subscription_id as stripe_subscription_id,
        status,
        current_period_end,
        stripe_price_id,
        cancel_at_period_end,
        'customer' as user_type,
        plan_id
       FROM subscriptions
       WHERE user_id = $1 AND status IN ('active', 'past_due')
       
       LIMIT 1`,
      [userId],
    );
    if (subscriptionResult?.rows?.length > 0) {
      // User has an active subscription
      const currentSubscription = subscriptionResult?.rows[0];
      userType = currentSubscription?.user_type || "client";

      const isActive = ["active"].includes(currentSubscription?.status);

      let planName;
      let amount = 0;
      let currency = "usd";

      if (userType === "customer" && currentSubscription?.plan_id) {
        const planResult = await db.query(
          `SELECT plan_name FROM membership_plan WHERE plan_id = $1`,
          [currentSubscription.plan_id],
        );
        planName = planResult?.rows[0]?.plan_name || "Unknown Plan";

        try {
          if (currentSubscription?.stripe_price_id) {
            const details = await getPlanDetailsFromPriceId(currentSubscription.stripe_price_id);
            amount = details.amount;
            currency = details.currency;
          }
        } catch (error) {
          console.error("Error fetching plan price details from Stripe:", error);
        }
      } else {
        try {
          const details = await getPlanDetailsFromPriceId(
            currentSubscription.stripe_price_id,
          );
          planName = details.name || "Unknown Plan";
          amount = details.amount;
          currency = details.currency;
        } catch (error) {
          console.error("Error fetching plan details from Stripe:", error);
          planName = "Unknown Plan";
        }
      }

      res.send({
        isActive: isActive,
        userType: userType, // 'client' or 'customer'
        subscription: {
          planName: planName,
          amount,
          currency,
          stripeSubscriptionId: currentSubscription?.stripe_subscription_id,
          status: currentSubscription?.status,
          currentPeriodEnd: currentSubscription?.current_period_end,
          stripePriceId: currentSubscription?.stripe_price_id,
          cancelAtPeriodEnd: currentSubscription?.cancel_at_period_end,
        },
      });
    } else {
      // User does not have any active subscription
      const totalBookCount = await totalBooks(db, entityId);
      const totalUsersCount = await totalUsers(db, entityId);

      // Library Customer
      if (userType === "customer") {
        res.json({
          isActive: false,
          userType: null,
          subscription: null,
        });
      } else {
        // saas client with Free Plan
        res.json({
          isActive: false,
          userType: null,
          subscription: null,
          booksCount: totalBookCount?.books || 0,
          userCounts: totalUsersCount?.users || 0,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching user subscription status:", error);

    res
      .status(500)
      .json({ message: "Error Fetching user subscription details" });
  }
});
module.exports = router;
