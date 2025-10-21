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
      // New Subscription
      case "checkout.session.completed":
        const session = event?.data?.object;
        console.log(session, "Session of checkout");
        const metadata = session.metadata;

        const entityId = metadata?.entityId;
        const subdomain = metadata?.subdomain;

        const user_type = metadata?.user_type;

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
          const customerId = checkoutSession?.customer;

          console.log(
            "Items Subscription: ",
            checkoutSession?.subscription?.items?.data[0]
          );

          // Update the customer's ID
          await db.query(
            `UPDATE users SET stripe_customer_id =$1 WHERE id=$2`,
            [customerId, dbUserId]
          );

          // User Type: CLIENT
          if (user_type == "client") {
            //
            await db.query(
              `INSERT INTO client_subscription(
            user_id,stripe_price_id,stripe_product_id,
            subscription_id, current_period_end, latest_invoice_id,
            status,start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`,
              [
                userId,
                subscription?.plan?.id,
                subscription?.plan?.product,
                subscription?.id,
                new Date(subscriptionItem?.current_period_end * 1000),
                subscription?.latest_invoice,
                subscription?.status,
                new Date(subscriptionItem?.current_period_start * 1000),
                new Date(subscriptionItem?.current_period_end * 1000),
              ]
            );
          } else {
            // USER TYPE - CUSTOMER
            const dbPlanId = await db.query(
              `SELECT plan_id from membership_plan WHERE stripe_product_id=$1 `,
              [subscriptionItem?.plan?.product]
            );
            if (dbPlanId.rows === 0) {
              console.log("No plan exists for this product Id");
            }

            //
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
        // Check if the status is active and the previous status wasn't 'active'
        // (to avoid constant updates during minor changes)
        if (subscription.status === "active") {
          await db.query(
            `
            UPDATE subscriptions SET 
                status = $1, 
                current_period_end = $2,
                latest_invoice_id = $3,
                updated_at = NOW()
            WHERE subscription_id = $4
        `,
            [
              subscription.status,
              new Date(subscription.current_period_end * 1000),
              subscription.latest_invoice,
              subscription.id,
            ]
          );
          // If the user changed plans (e.g., monthly to annual), you'd update
          // stripe_price_id and credits_allocated here too.
        }

        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object;
        await db.query(
          `
        UPDATE subscriptions SET 
            status = $1,
            auto_renew  
            end_date = NOW(),
            updated_at = NOW()
        WHERE subscription_id = $2
    `,
          [
            "canceled", // Use 'canceled' or 'expired'
            subscriptionDeleted.id,
          ]
        );
        // Removed ACCESS to library pro features here!
        break;

      // Renew Subscription
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log(invoice, "Payment succeed");

        // if (invoice.billing_reason === "subscription_cycle") {
        //   console.log(" Successfully subscription renewed!");

        //   const stripeSubscriptionId = invoice.subscription;

        //   // 1. FIND the subscription in your database with active status.

        //   //  2.  UPDATEthe existing record to make its status inactive, then inserting a new one with active status.
        //   const subscriptionRecord = await db.query(
        //     `SELECT id, user_id,stripe_price_id,stripe_product_id from client_subscriptions  where subscription_id=$1`,
        //     [stripeSubscriptionId]
        //   );

        //   if (subscriptionRecord.rows.length > 0) {
        //     // 3. UPDATE the subscription to add new period in your database.

        //     // 4. fetch the latest subscription data from Stripe.
        //     const subscription = await stripe.subscriptions.retrieve(
        //       stripeSubscriptionId
        //     );

        //     await db.query(
        //       `INSERT INTO client_subscription(
        //     user_id,stripe_price_id,stripe_product_id,
        //     subscription_id, current_period_end, latest_invoice_id,
        //     status,start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`,
        //       [
        //         subscriptionRecord.rows[0]?.user_id,
        //         subscriptionRecord.rows[0]?.stripe_price_id,
        //         subscriptionRecord.rows[0]?.stripe_product_id,
        //         subscription?.id,
        //         new Date(subscription.current_period_end * 1000),
        //          invoice.id,
        //         subscription?.status,
        //         new Date(subscription.current_period_start * 1000),
        //         new Date(subscription.current_period_end * 1000),
        //       ]
        //     );
          
        

        //     console.log(
        //       `Updated subscription ${stripeSubscriptionId} for the new period.`
        //     );
        //   } else {
        //     console.warn(
        //       `Webhook for renewal received, but no matching subscription found for ID: ${stripeSubscriptionId}`
        //     );
        //   }
        // }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log(invoice, "PAyment failed");
        
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


// Invoice payment succeed

/* {
  id: 'in_1SKUEtCs7Tavj7OjXLleXv6r',
  object: 'invoice',
  account_country: 'US',
  account_name: null,
  account_tax_ids: null,
  amount_due: 249900,
  amount_overpaid: 0,
  amount_paid: 249900,
  amount_remaining: 0,
  amount_shipping: 0,
  application: null,
  attempt_count: 0,
  attempted: true,
  auto_advance: false,
  automatic_tax: {
    disabled_reason: null,
    enabled: false,
    liability: null,
    provider: null,
    status: null
  },
  automatically_finalizes_at: null,
  billing_reason: 'subscription_create',
  collection_method: 'charge_automatically',
  created: 1761009591,
  currency: 'pkr',
  custom_fields: null,
  customer: 'cus_TH2J0OtyxB3D6W',
  customer_address: {
    city: null,
    country: 'PK',
    line1: null,
    line2: null,
    postal_code: null,
    state: null
  },
  customer_email: 'zoya.akhter@gmail.com',
  customer_name: 'Zoya Akhter',
  customer_phone: null,
  customer_shipping: null,
  customer_tax_exempt: 'none',
  customer_tax_ids: [],
  default_payment_method: null,
  default_source: null,
  default_tax_rates: [],
  description: null,
  discounts: [],
  due_date: null,
  effective_at: 1761009591,
  ending_balance: 0,
  footer: null,
  from_invoice: null,
  hosted_invoice_url: 'https://invoice.stripe.com/i/acct_1SFPl1Cs7Tavj7Oj/test_YWNjdF8xU0ZQbDFDczdUYXZqN09qLF9USDJKZXVsejh4SEtUNVVKUXVhQzdlN01GTm5RMHU3LDE1MTU1MDM5NQ0200CNTjpGGe?s=ap',
  invoice_pdf: 'https://pay.stripe.com/invoice/acct_1SFPl1Cs7Tavj7Oj/test_YWNjdF8xU0ZQbDFDczdUYXZqN09qLF9USDJKZXVsejh4SEtUNVVKUXVhQzdlN01GTm5RMHU3LDE1MTU1MDM5NQ0200CNTjpGGe/pdf?s=ap',
  issuer: { type: 'self' },
  last_finalization_error: null,
  latest_revision: null,
  lines: {
    object: 'list',
    data: [ [Object] ],
    has_more: false,
    total_count: 1,
    url: '/v1/invoices/in_1SKUEtCs7Tavj7OjXLleXv6r/lines'
  },
  livemode: false,
  metadata: {},
  next_payment_attempt: null,
  number: '023WODXB-0001',
  on_behalf_of: null,
  parent: {
    quote_details: null,
    subscription_details: { metadata: {}, subscription: 'sub_1SKUEvCs7Tavj7OjWdgoR7WC' },
    type: 'subscription_details'
  },
  payment_settings: {
    default_mandate: null,
    payment_method_options: {
      acss_debit: null,
      bancontact: null,
      card: [Object],
      customer_balance: null,
      konbini: null,
      sepa_debit: null,
      us_bank_account: null
    },
    payment_method_types: [ 'card' ]
  },
  period_end: 1761009591,
  period_start: 1761009591,
  post_payment_credit_notes_amount: 0,
  pre_payment_credit_notes_amount: 0,
  receipt_number: null,
  rendering: null,
  shipping_cost: null,
  shipping_details: null,
  starting_balance: 0,
  statement_descriptor: null,
  status: 'paid',
  status_transitions: {
    finalized_at: 1761009591,
    marked_uncollectible_at: null,
    paid_at: 1761009592,
    voided_at: null
  },
  subtotal: 249900,
  subtotal_excluding_tax: 249900,
  test_clock: null,
  total: 249900,
  total_discount_amounts: [],
  total_excluding_tax: 249900,
  total_pretax_credit_amounts: [],
  total_taxes: [],
  webhooks_delivered_at: null
} Payment succeed */