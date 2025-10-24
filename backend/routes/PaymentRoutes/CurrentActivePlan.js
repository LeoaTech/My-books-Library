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

async function getPlanNameFromPriceId(priceId) {
  if (!priceId) {
    throw new Error("Price ID is undefined, cannot fetch plan details.");
  }

  const price = await stripe.prices.retrieve(priceId, {
    expand: ["product"],
  });

  const product = price.product;
  return product.name || undefined;
}

//Get Current Plan:
router.get("/", async (req, res) => {
  console.log(req.user);

  const { userId } = req.user;
  const entityId = req?.entityId || req?.entity_id;
  try {
    const subscriptionResult = await db.query(
      `SELECT stripe_subscription_id, status, current_period_end, stripe_price_id,cancel_at_period_end
       FROM client_subscription
       WHERE user_id = $1`,
      [userId]
    );

    if (subscriptionResult.rows.length > 0) {
      // User has subscription
      const currentSubscription = subscriptionResult?.rows[0];

      const isActive = ["active", "trialing"].includes(
        currentSubscription.status
      );

       const planName = await getPlanNameFromPriceId(
        currentSubscription.stripe_price_id
      );

      res.send({
        isActive: isActive,
        subscription: {
          planName: currentSubscription ? planName : null,
          stripeSubscriptionId: currentSubscription.stripe_subscription_id,
          status: currentSubscription.status,
          currentPeriodEnd: currentSubscription.current_period_end,
          stripePriceId: currentSubscription.stripe_price_id,
          cancelAtPeriodEnd:currentSubscription?.cancel_at_period_end
        },
      });
    } else {
      // User does not have an active subscription, Restrict the resource access for users

      const totalBookCount = await totalBooks(db, entityId);
      console.log(totalBookCount, "Total Books");
      const totalUsersCount = await totalUsers(db, entityId);

      res.json({
        isActive: false,
        subscription: null,
        booksCount: totalBookCount?.books || 0,
        userCounts: totalUsersCount?.users || 0,
      });
    }
  } catch (error) {
    console.error("Error fetching user subscription status:", error);

    res.status(500).json({ message: "Error Fetching user subscription details" });
  }
});
module.exports = router;
