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
        // console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event?.data.object;
        status = subscription?.status;
        // console.log(`Subscription status is ${status}.`);
        //  define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      // New Subscription
      case "checkout.session.completed":
        const session = event?.data?.object;
        // console.log(session, "Session of checkout");
        const metadata = session.metadata;

        const entityId = metadata?.entityId;
        const subdomain = metadata?.subdomain;

        const user_type = metadata?.user_type;
        const planName = metadata?.planName;

        const userId = session?.client_reference_id || metadata?.app_client_id;

        if (session?.subscription) {
          // Checkout Session:
          const checkoutSession = await stripe.checkout.sessions.retrieve(
            event?.data?.object?.id,
            {
              expand: ["subscription"],
            }
          );
          console.log(
            "Full subscription from checkout: ",
            checkoutSession?.subscription
          );

          const subscription = checkoutSession?.subscription;
          console.log(subscription, "Subscription");
          const subscriptionItem =
            checkoutSession?.subscription?.items?.data[0];
          //  DB save data for user subscription
          const dbUserId = checkoutSession?.client_reference_id || userId;
          const customerId = session?.cutomer || checkoutSession?.customer;

          // console.log(
          //   "Items Subscription: ",
          //   checkoutSession?.subscription?.items?.data[0]
          // );

          // User Type: CLIENT
          if (user_type == "client") {
            //

            const subscriptionId = session?.subscription;
            // console.log("In Client Type", subscriptionId);

            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );

            // Update the customer's ID
            await db.query(
              `UPDATE users SET stripe_customer_id =$1, plan =$2 WHERE id=$3`,
              [customerId, planName, dbUserId]
            );

            await db.query(
              `INSERT INTO client_subscription (
                        user_id, stripe_subscription_id, stripe_price_id, stripe_product_id,
                        status, current_period_end, cancel_at_period_end, start_date, auto_renew
                    ) VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6), $7,TO_TIMESTAMP($8),$9) ON CONFLICT (stripe_subscription_id) DO NOTHING`,
              [
                userId,
                subscription.id,
                subscription.items.data[0].price.id,
                subscription.items.data[0].price.product,
                subscription.status, // e.g., 'active' or 'trialing'
                subscription?.items.data[0]?.current_period_end,
                subscription.cancel_at_period_end,
                subscription?.items.data[0]?.current_period_start,
                true,
              ]
            );
          } else {
            // USER TYPE - CUSTOMER
            const dbPlanId = await db.query(
              `SELECT plan_id,plan_name from membership_plan WHERE stripe_product_id=$1 `,
              [subscriptionItem?.plan?.product]
            );
            if (dbPlanId.rows === 0) {
              console.log("No plan exists for this product Id");
              break;
            }

            const dbPlan = dbPlanId?.rows[0];
            // Update the customer's ID
            await db.query(
              `UPDATE users SET stripe_customer_id =$1 and plan =$2 WHERE id=$3`,
              [customerId, dbPlan?.plan_name, dbUserId]
            );

            //
            await db.query(
              `INSERT INTO subscriptions(
            user_id, plan_id,stripe_price_id,
            subscription_id, current_period_end, latest_invoice_id,
            status,start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`,
              [
                dbUserId,
                dbPlan.plan_id,
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
        }
        break;
      case "customer.subscription.created":
        subscription = event.data.object;
        // status = subscription?.status;
        // console.log(`Subscription status is ${subscription}.`);
        break;

      case "customer.subscription.updated":
        subscription = event?.data?.object;
        // console.log(`Subscription is ${event?.data?.object}.`);

        status = subscription?.status;
        console.log(`Subscription status is ${status}.`);
        // define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);

        await db.query(
          `UPDATE client_subscription 
         SET 
            stripe_price_id = $1,
            stripe_product_id = $2,
            status = $3,
            current_period_end = TO_TIMESTAMP($4),
            cancel_at_period_end = $5
         WHERE stripe_subscription_id = $6`,
          [
            subscription.items.data[0].price.id,
            subscription.items.data[0].price.product,
            subscription.status,
            subscription.items.data[0].current_period_end,
            subscription.cancel_at_period_end,
            subscription.id,
          ]
        );

        const getUserId = await db.query(
          `SELECT id from users WHERE stripe_customer_id=$1`,
          [subscription.customer]
        );
        if (getUserId.rows > 0) {
          if (subscription.status === "canceled") {
            await db.query(`UPDATE user set plan =$1 WHERE id =$2`, [
              "Free",
              getUserId?.rows[0].id,
            ]);
          }
        }

        console.log(
          `Subscription ${subscription.id} was updated in the database.`
        );
      

        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object;
        await db.query(
          `UPDATE client_subscription SET 
            status = $1,
            updated_at = NOW()
        WHERE stripe_subscription_id = $2
    `,
          [
            "canceled", 
            subscriptionDeleted.id,
          ]
        );

        const UserId = await db.query(
          `SELECT id from users WHERE stripe_customer_id=$1`,
          [subscription.customer]
        );
        if (subscription.status === "canceled") {
          await db.query(`UPDATE user set plan =$1 WHERE id =$1`, [
            "Free",
            UserId?.rows[0].id,
          ]);
        }
        break;

      case "invoice.paid": {
        const invoice = event.data.object;
        // console.log(invoice, "invoice Paid webhook");

        // Wait 2 seconds before checkout session complete webhook populate the table
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay for 2 seconds

        const customerId = invoice.customer;
        if (!customerId) {
          console.error(
            `Webhook Error: Invoice ${invoice.id} has no customer ID.`
          );
          break;
        }

        const subscriptionId = invoice.parent.subscription_details.subscription;
        if (!subscriptionId) {
          console.log(
            `Skipping invoice ${invoice.id} because no subscription exists.`
          );
          break;
        }
        // Find user_id and subscription
        const subResult = await db.query(
          `SELECT id, user_id 
                     FROM client_subscription 
                     WHERE stripe_subscription_id = $1`,
          [subscriptionId]
        );

        if (subResult.rows.length === 0) {
          console.log(
            `Subscription ${subscriptionId} not found. Creating it from invoice.paid event to handle race condition.`
          );
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );
          const userResult = await db.query(
            "SELECT id FROM users WHERE stripe_customer_id = $1",
            [customerId]
          );
          if (userResult.rows.length === 0) {
            console.error(
              ` User not found for customer_id: ${customerId}`
            );
            break;
          }
          const userId = userResult.rows[0].id;

          // Create the subscription record
          await db.query(
            `INSERT INTO client_subscription (user_id, stripe_subscription_id, stripe_price_id, stripe_product_id, status, current_period_end, cancel_at_period_end, start_date,auto_renew)
             VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6), $7,TO_TIMESTAMP($8),$9)
                 ON CONFLICT (stripe_subscription_id) DO NOTHING`,
            [
              userId,
              subscription.id,
              subscription.items.data[0].price.id,
              subscription.items.data[0].price.product,
              subscription.status,
              subscription.items.data[0].current_period_end,
              subscription.cancel_at_period_end,
              subscription.items.data[0].current_period_start,
              true,
            ]
          );
          console.log(
            `Subscription record ${subscriptionId} created from invoice webhook.`
          );

          // Re-fetch the record we just created to get its primary key
          subRecord = await db.query(
            "SELECT id, user_id FROM client_subscription WHERE stripe_subscription_id = $1",
            [subscriptionId]
          );
        }
        // We only care about invoices for new subscriptions or renewals
        if (
          invoice.billing_reason === "subscription_create" ||
          invoice.billing_reason === "subscription_cycle" ||
          invoice.billing_reason === "subscription_update"
        ) {
          const { id: clientSubscriptionId, user_id: userId } =
            subResult.rows[0];

          // --- INSERT into client_transactions ---
          await db.query(
            `INSERT INTO client_transactions (
                user_id, client_subscription_id, stripe_subscription_id, stripe_invoice_id,
                stripe_charge_id, amount_paid, status, billing_reason, invoice_pdf
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (stripe_invoice_id) DO NOTHING`, // This prevents duplicates
            [
              userId,
              clientSubscriptionId,
              subscriptionId,
              invoice.id,
              invoice.charge,
              invoice.amount_paid,
              "paid",
              invoice.billing_reason,
              invoice.invoice_pdf,
            ]
          );
          console.log(`Transaction record created for invoice ${invoice.id}`);
        }
        break;
      }

      // Renew Subscription
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        // console.log(invoice, "Invoice Payment succeeded Webhook");

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        // console.log(invoice, "Payment failed webhook");

        // A renewal payment failed.
        // 1. Find the subscription in your DB.
        // 2. Update its status to 'past_due'.
        // 3. Send the user an email notification to update their payment method or they will not access the Pro plan.
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
    response.send();
  }
);

module.exports = router;
