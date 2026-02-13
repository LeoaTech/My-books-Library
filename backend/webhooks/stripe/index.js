const express = require("express");
const { default: Stripe } = require("stripe");
const db = require("../../config/dbConfig.js");
const stripe = require("../../config/stripe.js");
const { emailQueue, pushQueue } = require("../../queues/index.js");


const router = express.Router();

router.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;

    const signature = request.headers["stripe-signature"];
    
    // Platform Webhook Secret
    try {
        event = Stripe.default.webhooks.constructEvent(
          request.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        // Connect Account Webhook Secret
        try {
            event = Stripe.default.webhooks.constructEvent(
              request.body,
              signature,
              process.env.STRIPE_CONNECT_WEBHOOK_SECRET
            );
        } catch (connectErr) {
            console.log(`Webhook signature verification failed for both secrets.`);
            console.log(`Platform Error: ${err.message}`);
            console.log(`Connect Error: ${connectErr.message}`);
            return response.sendStatus(400);
        }
    }
    let subscription;
    let status;
    let planName;
    let invoice;
    let metadata;

    let entityId;
    let subdomain;
    let subscriptionData;
    let userData;
    let userId;
    
    // check if webhook event is from a connected account (client's connected account)
    const connectedAccountId = event.account; //  account_id for connected account
    // console.log(`Stripe Event: ${event.type}, Connected Account: ${connectedAccountId || 'Platform'}`);
    
    // Handle the event
    switch (event.type) {
     
      // New Subscription
      case "checkout.session.completed":
        const session = event?.data?.object;

        metadata = session.metadata;

        entityId = metadata?.entityId;
        subdomain = metadata?.subdomain;

        const user_type = metadata?.user_type;
        planName = metadata?.planName;

        userId = session?.client_reference_id || metadata?.app_client_id;
        const invoiceId = session?.invoice;

        //  OverDue Fine Payment
        if (metadata?.type === "fine") {
          const { booking_id, user_id, book_title } = metadata;
          const amountPaid = session?.amount_total / 100;
          const paymentIntent = session?.payment_intent;

          await db.query(
            `INSERT INTO fine_transactions (
                user_id, booking_id, stripe_session_id, stripe_payment_intent_id, amount_paid, status
             ) VALUES ($1, $2, $3, $4, $5, 'paid')
             ON CONFLICT (stripe_session_id) DO NOTHING`,
            [user_id, booking_id, session.id, paymentIntent, amountPaid]
          );

          const bookingRes = await db.query("SELECT items FROM bookings WHERE id = $1", [booking_id]);
          if (bookingRes.rows.length > 0) {
            let items = bookingRes.rows[0].items;
            
             const updatedItems = items.map(item => {
                if (item.title === book_title && parseFloat(item.overdue_fine) > 0) {
                    
                    const isReturned = item.status === 'returned';
                    
                    if (isReturned) {
                       return { ...item, fine_paid: true, overdue_fine: 0 }; 
                    } else {
                       return { 
                           ...item, 
                           fine_paid: true, 
                           overdue_fine: 0, 
                           status: 'issued', 
                           return_due: new Date().toISOString() 
                       };
                    }
                }
                return item;
            });

            await db.query("UPDATE bookings SET items = $1 WHERE id = $2", [JSON.stringify(updatedItems), booking_id]);
          }
          
          break; 
        }
                
        // Get invoice from stripe account (connected or platform)
        if (connectedAccountId && invoiceId) {
          invoice = await stripe.invoices.retrieve(invoiceId, {
            stripeAccount: connectedAccountId
          });
        } else if (invoiceId) {
          invoice = await stripe.invoices.retrieve(invoiceId);
        }

        if (session?.subscription) {
          const retrieveOptions = { expand: ["subscription"] };
          
          const checkoutSession = connectedAccountId
            ? await stripe.checkout.sessions.retrieve(
                event?.data?.object?.id,
                retrieveOptions,
                { stripeAccount: connectedAccountId }
              )
            : await stripe.checkout.sessions.retrieve(
                event?.data?.object?.id,
                retrieveOptions
              );

          const subscription = checkoutSession?.subscription;
          const subscriptionItem =
            checkoutSession?.subscription?.items?.data[0];
          //  DB save data for user subscription
          const dbUserId = checkoutSession?.client_reference_id || userId;
          const customerId = session?.cutomer || checkoutSession?.customer;

          // User Type: CLIENT
          if (user_type == "client") {
            //

            const subscriptionId = session?.subscription;

            // get subscription from stripe account
            const subscription = connectedAccountId
              ? await stripe.subscriptions.retrieve(subscriptionId, {
                  stripeAccount: connectedAccountId
                })
              : await stripe.subscriptions.retrieve(subscriptionId);
            userData = {
              name: session?.customer_details?.name || "",
              city: session?.customer_details?.address.city || "",
              country: session?.customer_details?.address?.country || "",
              phone: session?.customer_details?.phone || "",
              subdomain,
            };
            subscriptionData = {
              plan_name: planName,
              subscription_id: subscription?.id,
              amount: (session?.amount_total / 100).toFixed(2),
              billing_cycle: subscriptionItem?.plan?.interval,
              invoice_link: invoice?.hosted_invoice_url || "",
            };
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
                subscription.status,
                subscription?.items.data[0]?.current_period_end,
                subscription.cancel_at_period_end,
                subscription?.items.data[0]?.current_period_start,
                true,
              ]
            );

            await emailQueue.add("saas-subscription-created", {
              to: session?.customer_email,
              userData,
              subscriptionData,
              entityId,
            });

            await pushQueue.add("saas-subscription-created-push", {
              entityId,
              userId: dbUserId,
              userData,
              subscriptionData,
            });
          } else {
            // USER TYPE - CUSTOMER
            let dbPlanId;
            

            if (connectedAccountId) {
              dbPlanId = await db.query(
                `SELECT plan_id, plan_name FROM membership_plan 
                 WHERE plan_details->>'stripe_account_id' = $1
                 AND (
                   plan_details->'monthly'->>'price_id' = $2 
                   OR plan_details->'yearly'->>'price_id' = $2
                 )
                 LIMIT 1`,
                [connectedAccountId, subscriptionItem?.plan?.id]
              );
            }
            
            // 
            if (!dbPlanId || dbPlanId.rows.length === 0) {
              dbPlanId = await db.query(
                `SELECT plan_id, plan_name FROM membership_plan 
                 WHERE stripe_product_id = $1`,
                [subscriptionItem?.plan?.product]
              );
            }
            
            if (dbPlanId.rows.length === 0) {
              // console.log("No plan exists for this product Id or account");
              break;
            }

            const dbPlan = dbPlanId?.rows[0];
            // Update the customer's ID
            await db.query(
              `UPDATE users SET stripe_customer_id = $1, plan = $2 WHERE id = $3`,
              [customerId, dbPlan?.plan_name, dbUserId]
            );

            //
            await db.query(
              `INSERT INTO subscriptions(
            user_id, plan_id,stripe_price_id,
            subscription_id, current_period_end,
            status,start_date, cancel_at_period_end) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                dbUserId,
                dbPlan.plan_id,
                subscription?.plan?.id,
                subscription?.id,
                new Date(subscriptionItem?.current_period_end * 1000),
                subscription?.status,
                new Date(subscriptionItem?.current_period_start * 1000),
                subscription.cancel_at_period_end,
              ]
            );
            
            // console.log(`customer subscription created: ${subscription?.id} for user ${dbUserId}`);
          }
        }
        break;

      case "customer.subscription.created":
        subscription = event.data.object;
        break;

      case "customer.subscription.updated":
        subscription = event?.data?.object;
        // console.log(subscription, "subscription");
        userId = subscription?.client_reference_id || subscription?.metadata?.app_client_id;

        metadata = subscription?.metadata;

        entityId = metadata?.entityId;
        subdomain = metadata?.subdomain;
        const prevAttributes = event?.data?.previous_attributes;

        if (
          !prevAttributes?.items &&
          !prevAttributes?.plan &&
          prevAttributes?.cancel_at_period_end === undefined
        ) {
          // console.log("No subscription changes detected.");
          break;
        }

        planName = subscription?.metadata?.planName;

        status = subscription?.status;

        const isClientSub = await db.query(
          "SELECT id FROM client_subscription WHERE stripe_subscription_id = $1",
          [subscription.id]
        );

        if (isClientSub.rows.length > 0) {
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
        } else {
          // Check if it is library customer subscription
          const isLibrarySub = await db.query(
            "SELECT id FROM subscriptions WHERE subscription_id = $1",
            [subscription.id]
          );

          if (isLibrarySub.rows.length > 0) {
            // Get the new price ID from the subscription
            const newPriceId = subscription.items.data[0].price.id;
            
            let newPlanId = null;
            if (connectedAccountId) {
              const planLookup = await db.query(
                `SELECT plan_id, plan_name FROM membership_plan 
                 WHERE plan_details->>'stripe_account_id' = $1
                 AND (
                   plan_details->'monthly'->>'price_id' = $2 
                   OR plan_details->'yearly'->>'price_id' = $2
                 )
                 LIMIT 1`,
                [connectedAccountId, newPriceId]
              );
              
              if (planLookup.rows.length > 0) {
                newPlanId = planLookup.rows[0].plan_id;
                const newPlanName = planLookup.rows[0].plan_name;
                
                // update the user's plan name
                const userIdResult = await db.query(
                  `SELECT user_id FROM subscriptions WHERE subscription_id = $1`,
                  [subscription.id]
                );
                
                if (userIdResult.rows.length > 0) {
                  await db.query(
                    `UPDATE users SET plan = $1 WHERE id = $2`,
                    [newPlanName, userIdResult.rows[0].user_id]
                  );
                }
              }
            }
            
            // Update the subscription record
            await db.query(
              `UPDATE subscriptions 
             SET 
                stripe_price_id = $1,
                status = $2,
                current_period_end = TO_TIMESTAMP($3),
                cancel_at_period_end = $4,
                auto_renew = $5
                ${newPlanId ? ', plan_id = $7' : ''}
             WHERE subscription_id = $6`,
              newPlanId 
                ? [
                    newPriceId,
                    subscription.status,
                    subscription.items.data[0].current_period_end,
                    subscription.cancel_at_period_end,
                    !subscription.cancel_at_period_end,
                    subscription.id,
                    newPlanId
                  ]
                : [
                    newPriceId,
                    subscription.status,
                    subscription.items.data[0].current_period_end,
                    subscription.cancel_at_period_end,
                    !subscription.cancel_at_period_end,
                    subscription.id,
                  ]
            );
            
            // console.log(`customer subscription updated: ${subscription.id}`);
          }
        }


        if (
          subscription.cancel_at_period_end === true &&
          prevAttributes?.cancel_at_period_end === false
        ) {
          const customer = connectedAccountId
            ? await stripe.customers.retrieve(subscription.customer, {
                stripeAccount: connectedAccountId
              })
            : await stripe.customers.retrieve(subscription.customer);
          userData = {
            name: customer?.name || "",
            city: customer?.address.city || "",
            country: customer?.address?.country || "",
            phone: customer?.phone || "",
            subdomain,
          };
          subscriptionData = {
            plan_name: planName,
            end_date: new Date(
              subscription?.items?.data[0]?.current_period_end * 1000
            ).toDateString(),
          };
          planName = subscription?.metadata?.planName;

          await emailQueue.add("saas-subscription-cancel-request", {
            to: customer?.email,
            userData,
            subscriptionData,
            entityId,
          });
          await pushQueue.add("saas-subscription-cancel-request-push", {
            entityId,
            userId,
            userData,
            subscriptionData,
          });

          // console.log("email sent for cancellation request");
        }

        const getUserId = await db.query(
          `SELECT id from users WHERE stripe_customer_id=$1`,
          [subscription.customer]
        );

        if (getUserId.rows > 0) {
          if (
            subscription.status === "canceled" ||
            subscription.status === "cancelled"
          ) {
            await db.query(`UPDATE user set plan =$1 WHERE id =$2`, [
              "Free",
              getUserId?.rows[0].id,
            ]);
          }
        }

        const isPlanChange = prevAttributes?.items !== undefined;
        if (isPlanChange && subscription.cancel_at_period_end === false) {
          const oldPriceId = prevAttributes?.items?.data?.[0]?.price?.id;

          const currentPriceId = subscription?.items?.data[0]?.price?.id;

          if (oldPriceId && oldPriceId !== currentPriceId) {
            const customer = connectedAccountId
              ? await stripe.customers.retrieve(subscription.customer, {
                  stripeAccount: connectedAccountId
                })
              : await stripe.customers.retrieve(subscription.customer);
            userData = {
              name: customer?.name || "",
              city: customer?.address.city || "",
              country: customer?.address?.country || "",
              phone: customer?.phone || "",
              subdomain,
            };


            const currentPlanName =
              subscription?.items?.data[0]?.price?.nickname ||
              subscription?.metadata?.planName ||
              "New Plan";

              
            subscriptionData = {
              plan_name: currentPlanName,
              amount: (
                subscription?.items?.data[0]?.price?.unit_amount / 100
              ).toFixed(2),
              billing_cycle:
                subscription?.items?.data[0]?.price?.recurring?.interval || "",
            };
            planName = subscription?.metadata?.planName;

            

            // Send Email Alert
            await emailQueue.add("saas-subscription-updated", {
              to: customer?.email,
              userData,
              subscriptionData,
              entityId,
            });

            // Send Push Alert

            await pushQueue.add("saas-subscription-updated-push", {
              entityId,
              userId: getUserId?.rows[0].id,
              userData,
              subscriptionData,
            });
          }
        }

        // console.log(
        //   `Subscription ${subscription.id} was updated in the database.`
        // );

        break;

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object;
        // console.log(subscriptionDeleted, "Deleted subscription");

        // Check if client subscription
        const clientSubCheck = await db.query(
          "SELECT id FROM client_subscription WHERE stripe_subscription_id = $1",
          [subscriptionDeleted.id]
        );

        if (clientSubCheck.rows.length > 0) {
          await db.query(
            `UPDATE client_subscription SET 
              status = $1,
              updated_at = NOW()
          WHERE stripe_subscription_id = $2
      `,
            ["canceled", subscriptionDeleted.id]
          );
        } else {
           // Check if it is library subscription
           const libSubCheck = await db.query(
            "SELECT id FROM subscriptions WHERE subscription_id = $1",
            [subscriptionDeleted.id]
          );
          if (libSubCheck.rows.length > 0) {
             await db.query(
            `UPDATE subscriptions SET 
              status = $1,
              updated_at = NOW()
          WHERE subscription_id = $2
      `,
            ["canceled", subscriptionDeleted.id]
          );
          }
        }


        const getUser = await db.query(
          `SELECT id from users WHERE stripe_customer_id=$1`,
          [subscriptionDeleted?.customer]
        );
        if (getUser?.rows?.length > 0) {
          if (
            subscriptionDeleted.status === "canceled" ||
            subscriptionDeleted.status === "cancelled"
          ) {
            await db.query(`UPDATE user set plan =$1 WHERE id =$1`, [
              "Free",
              getUser?.rows[0]?.id,
            ]);

            // Send Email

            const entityId = subscriptionDeleted?.metadata?.entityId;
            const subdomain = subscriptionDeleted?.metadata?.subdomain;

            userData= {
                name: customer?.name || "Customer",
                city: customer?.address?.city || "",
                country: customer?.address?.country || "",
                phone: customer?.phone || "",
                subdomain,
              }
            await emailQueue.add("saas-subscription-deleted", {
              to: customer?.email,
              userData,
              subscriptionData: {
                plan_name: "Free",
              },
              entityId,
            });

            
             await pushQueue.add("saas-subscription-deleted-push", {
            entityId,
            userId:getUser?.rows[0]?.id,
            userData,
            subscriptionData:{plan_name: "Free"},
          });
          }
        }
        break;

      case "invoice.paid": {
        const invoice = event.data.object;
        // console.log(invoice, "invoice Paid webhook");

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const customerId = invoice.customer;
        if (!customerId) {
          console.error(
            `Webhook Error: Invoice ${invoice.id} has no customer ID.`
          );
          break;
        }

        const subscriptionId = invoice.parent.subscription_details.subscription;
        if (!subscriptionId) {
          // console.log(
          //   `Skipping invoice ${invoice.id} because no subscription exists.`
          // );
          break;
        }
        const subResult = await db.query(
          `SELECT id, user_id, 'client' as type
                     FROM client_subscription 
                     WHERE stripe_subscription_id = $1
           UNION ALL
           SELECT id, user_id, 'customer' as type
                     FROM subscriptions
                     WHERE subscription_id = $1
                     `,
          [subscriptionId]
        );

        let subscriptionRecord = subResult?.rows?.[0];

        if (!subscriptionRecord) {
          // console.log(
          //   `Subscription ${subscriptionId} not found in DB. Checking if we need to create it (Client vs Customer logic).`
          // );
          
          const subscription = connectedAccountId
            ? await stripe.subscriptions.retrieve(subscriptionId, {
                stripeAccount: connectedAccountId
              })
            : await stripe.subscriptions.retrieve(subscriptionId);
          
           const userType = connectedAccountId ? 'customer' : (subscription.metadata?.user_type || 'client'); 
           
           if (userType === 'client') {
                  const userResult = await db.query(
                    "SELECT id FROM users WHERE stripe_customer_id = $1",
                    [customerId]
                  );
                  if (userResult?.rows?.length === 0) {
                    console.error(` User not found for customer_id: ${customerId}`);
                    break;
                  }
                  const userId = userResult?.rows[0]?.id;

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
                 const retrySub = await db.query(
                    "SELECT id, user_id, 'client' as type FROM client_subscription WHERE stripe_subscription_id = $1",
                    [subscriptionId]
                 );
                 subscriptionRecord = retrySub.rows[0];

           } else {
              //  console.log("customer subscription missing in DB for invoice.paid");
               break;
           }
        }

        if (
          invoice.billing_reason === "subscription_create" ||
          invoice.billing_reason === "subscription_cycle" ||
          invoice.billing_reason === "subscription_update"
        ) {
          if (!subscriptionRecord) break;
          
          const { id: dbSubscriptionId, user_id: userId, type } = subscriptionRecord;
          
          if (type === 'client') {
            // --- INSERT into client_transactions ---
            await db.query(
                `INSERT INTO client_transactions (
                    user_id, client_subscription_id, stripe_subscription_id, stripe_invoice_id,
                    stripe_charge_id, amount_paid, status, billing_reason, invoice_pdf
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (stripe_invoice_id) DO NOTHING`,
                [
                userId,
                dbSubscriptionId, // client_subscription_id
                subscriptionId,
                invoice.id,
                invoice.charge,
                invoice.amount_paid,
                "paid",
                invoice.billing_reason,
                invoice.invoice_pdf,
                ]
            );
            //  console.log(`Client Transaction record created for invoice ${invoice.id}`);
          } else {
              // --- INSERT into subscription_transactions (Library Customer) ---
               await db.query(
                `INSERT INTO subscription_transactions (
                    user_id, subscription_id, stripe_subscription_id, stripe_invoice_id,
                    stripe_charge_id, amount_paid, status, billing_reason, invoice_pdf
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (stripe_invoice_id) DO NOTHING`,
                [
                userId,
                dbSubscriptionId, // subscriptions table id
                subscriptionId,
                invoice.id,
                invoice.charge,
                invoice.amount_paid,
                "paid",
                invoice.billing_reason,
                invoice.invoice_pdf,
                ]
            );
            // console.log(`Library Customer Transaction record created for invoice ${invoice.id}`);
          }
        }
        break;
      }

      // Renew Subscription
      case "invoice.payment_succeeded": {
        const invoiceSucceed = event?.data?.object;
        // console.log(invoiceSucceed, "Invoice Payment succeeded Webhook");
        if (invoiceSucceed.billing_reason === "subscription_cycle") {
          const subscription = connectedAccountId
            ? await stripe.subscriptions.retrieve(invoiceSucceed.subscription, {
                stripeAccount: connectedAccountId
              })
            : await stripe.subscriptions.retrieve(invoiceSucceed.subscription);

          const customer = connectedAccountId
            ? await stripe.customers.retrieve(invoiceSucceed.customer, {
                stripeAccount: connectedAccountId
              })
            : await stripe.customers.retrieve(invoiceSucceed.customer);
          userId = invoiceSucceed?.client_reference_id || invoiceSucceed?.metadata?.app_client_id;

          const priceAmount =
            invoiceSucceed?.amount_paid / 100 ||
            subscription?.items?.data[0]?.price?.unit_amount / 100;
          const planName =
            subscription?.items?.data[0]?.price?.nickname ||
            subscription?.metadata?.planName ||
            "Plan";

          const nextBillingDate = new Date(
            subscription.current_period_end * 1000
          ).toDateString();

          const entityId = subscription.metadata?.entityId;
          const subdomain = subscription.metadata?.subdomain;

          userData = {
            name: customer?.name || "Customer",
            city: customer?.address?.city || "",
            country: customer?.address?.country || "",
            phone: customer?.phone || "",
            subdomain,
          };
          subscriptionData = {
            plan_name: planName,
            amount: priceAmount?.toFixed(2),
            next_billing_date: nextBillingDate,
          };
          // 3. Send the Renewal Email
          await emailQueue.add("saas-subscription-renewed", {
            to: customer?.email,
            userData,
            subscriptionData,
            entityId,
          });
          await pushQueue.add("saas-subscription-renewed-push", {
            entityId,
            userId,
            userData,
            subscriptionData,
          });

          // console.log(`Renewal email sent to ${customer.email}`);
        }
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
        console.log(`Unused event type ${event.type}.`);
    }
    response.send();
  }
);

module.exports = router;
