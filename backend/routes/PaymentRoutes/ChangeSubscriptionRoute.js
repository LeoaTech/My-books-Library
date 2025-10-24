const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const express = require("express");
const { checkAuth } = require("../../middleware/authMiddleware.js");

const router = express.Router();

router.use(checkAuth);
router.post("/", async (req, res) => {
  const { userId } = req.user; //
  const { newPriceId } = req.body; // "New Price Id"
  console.log(req.body, "Body");
  if (!newPriceId) {
    return res.status(400).json({ error: "newPriceId is required." });
  }
  // try {
  //   const findClientId = await db.query(
  //     `SELECT id,subscription_id, status, current_period_end from client_subscription WHERE user_id =$1 and status =ANY($2)`,
  //     [userId, ["active", "cancelled"]]
  //   );

  //   console.log(findClientId.rows, "Active subscriptions");

  //   if (findClientId.rows.length > 0) {
  //     const activeSubscription = findClientId.rows[0];

  //     // Check if subscription exists with active status
  //     if (activeSubscription && activeSubscription?.subscription_id) {
  //       console.log(
  //         `Cancelling existing Stripe subscription: ${activeSubscription?.subscription_id}`
  //       );

  //       // Plan is active, cancel its subscription on Stripe
  //       if (activeSubscription?.status == "active") {
  //         // Call Stripe API to cancel subscriptin . by default, it cancels at period end.
  //         const cancelledSub = await stripe.subscriptions.cancel(
  //           activeSubscription?.subscription_id
  //         );

  //         console.log(cancelledSub?.items?.data[0], "Cencell sub");

  //         await db.query(
  //           `UPDATE client_subscription SET
  //         status =$1,subscription_valid_until =$2, auto_renew = $3 WHERE id =$2 AND user_id =$3`,
  //           [
  //             "cancelled",
  //             new Date(activeSubscription.current_period_end * 1000),
  //             false,
  //             activeSubscription.id,
  //             userId,
  //           ]
  //         );

  //         res.status(200).json({
  //           message: `Subscription cancelled successfully. Free Plan will be active at the current subscription period end.`,
  //         });
  //       } else if (activeSubscription?.status == "cancelled") {
  //         const isSubscriptionValid =
  //           new Date() < new Date(activeSubscription?.current_period_end);

  //         // If subscription is expired, update users with Free plan
  //         if (!isSubscriptionValid) {
  //           await db.query(`UPDATE users SET plan =$1 WHERE id=$2`, [
  //             planName,
  //             userId,
  //           ]);
  //           const SchoolPlan = {
  //             planName: planName,
  //             status: "active", // The School plan is active
  //             accessUntil: null,
  //             renewsOn: null,
  //           };

  //           res.status(200).json({
  //             plan: SchoolPlan,
  //             message: `${SchoolPlan?.planName} plan activated successfully.`,
  //           });
  //         }
  //       }
  //     }
  //   } else {
  //     await db.query(`UPDATE users SET plan =$1 WHERE id=$2`, [
  //       planName,
  //       userId,
  //     ]);
  //     const SchoolPlan = {
  //       planName: planName,
  //       status: "active", // The School plan is active
  //       accessUntil: null,
  //       renewsOn: null,
  //     };

  //     res.status(200).json({
  //       plan: SchoolPlan,
  //       message: `${SchoolPlan?.planName} plan activated successfully.`,
  //     });
  //   }
  // } catch (error) {
  //   console.error("Failed to activate free plan in DB:", error);
  //   res.status(500).json({ error: "Internal server error." });
  // }

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
            id: currentItemId, // The ID of the subscription item to update
            price: newPriceId, // The ID of the new price
          },
        ],
        proration_behavior: "create_prorations", // This immediately invoices for the change
        cancel_at_period_end: false, 
      }
    );

    console.log(updatedSubscription,"Changed Plan Successfully");
    

    res.json({ message: "Subscription plan changed successfully." });
  } catch (error) {
    console.error("Stripe plan change failed:", error);
    res.status(500).json({ error: "Could not change subscription plan." });
  }
});

module.exports = router;
