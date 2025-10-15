const express = require("express");
const { default: Stripe } = require("stripe");
const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const router = express.Router();

router.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;

    const endpointSecret = WEBHOOK_SECRET;

    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = Stripe.default.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event?.data?.object;
        status = subscription?.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event?.data.object;
        status = subscription?.status;
        console.log(`Subscription status is ${status}.`);
        //  define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case "checkout.session.completed":
        const session = event?.data?.object;
        console.log(session, "Session of checkout");

        if (session?.subscription) {
          const checkoutSession = await stripe.checkout.sessions.retrieve(
            event?.data?.object?.id,
            {
              expand: ["subscription"],
            }
          );
          // console.log(
          //   "Full subscription from checkout: ",
          //   checkoutSession?.subscription
          // );

          const subscription = checkoutSession?.subscription;

          const subscriptionItem =
            checkoutSession?.subscription?.items?.data[0];
          //  DB save data for user subscription
          const dbUserId = checkoutSession?.client_reference_id;
          const customerId = checkoutSession?.customer;

          // console.log(
          //   "Items Subscription: ",
          //   checkoutSession?.subscription?.items?.data[0]
          // );

          const dbPlanId = await db.query(
            `SELECT plan_id from membership_plan WHERE stripe_product_id=$1 `,
            [subscriptionItem?.plan?.product]
          );
          if (dbPlanId.rows === 0) {
            console.log("No plan exists for this product Id");
          }
          // Update the customer's ID
          await db.query(
            `UPDATE users SET stripe_customer_id =$1 WHERE id=$2`,
            [customerId, dbUserId]
          );

          await db.query(
            `INSERT INTO subscriptions(
            user_id, plan_id,stripe_price_id,
            subscription_id, current_period_end, latest_invoice_id,
            status,start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`,
            [
              dbUserId,
              dbPlanId?.rows[0]?.plan_id,
              subscription?.plan?.id,
              subscription?.id,
              new Date(subscriptionItem?.current_period_end * 1000),
              subscription?.latest_invoice,
              subscription?.status,
              new Date(subscriptionItem?.current_period_start * 1000),
              new Date(subscriptionItem?.current_period_end * 1000),
            ]
          );
        }
        break;
      case "customer.subscription.created":
        subscription = event.data.object;
        // status = subscription?.status;
        console.log(`Subscription status is ${subscription}.`);
        break;

      case "customer.subscription.updated":
        subscription = event?.data?.object;
        status = subscription?.status;
        console.log(`Subscription status is ${status}.`);
        // define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
     
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
    response.send();
  }
);

module.exports = router;
