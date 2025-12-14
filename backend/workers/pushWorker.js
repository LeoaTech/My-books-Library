const { Worker } = require("bullmq");
const send_push_notification = require("../utils/send_push_notification");
const { connection } = require("../config/redisConfig.js");
const { getNotificationContent } = require("../utils/templatesHandler.js");
const db = require("../config/dbConfig.js");

const worker = new Worker(
  "push-notifications",
  async (job) => {
    const { name, data } = job;
    let tokens = data?.tokens || [];

    try {
      if ((!tokens || tokens.length === 0) && data?.userId) {
        // console.log(`Fetching tokens for User ID: ${data?.userId}`);
        const tokenResult = await db.query(
          `SELECT token FROM user_fcm_tokens WHERE user_id = $1`,
          [data?.userId]
        );
        tokens = tokenResult.rows.map((row) => row.token);
      }
      if (!tokens || tokens.length === 0) {
        // console.log(`No device tokens found for Job ${name}. Skipping.`);
        return;
      }
      const variables = {
        customer_name: data?.userData?.name || "User",
        library_name:
          data?.userData?.entity_name || data?.userData?.subdomain || "Library",
        entityId: data?.userData?.entity_id || data?.entityId,
        email: data?.userData?.email,
        phone: data?.userData?.phone || "",
        contact: "+923402134256",
        saas_app_name: "BookHive",
        saas_support_email: "info@bookhive.com",
        plan_name: data?.subscriptionData?.plan_name || "",
        billing_cycle: data?.subscriptionData?.billing_cycle || "",
        amount: data?.subscriptionData?.amount || "",
        invoice_link: data?.subscriptionData?.invoice_link || "",
        end_date: data?.subscriptionData?.end_date || "",
        next_billing_date: data?.subscriptionData?.next_billing_date || "",
        ...data,
      };
      const bookingVariables = {
        user_id: data?.bookingData?.user_id,
        booking_id: data?.bookingData?.id,
        address: data?.bookingData?.shipping_address,
      };
      let content;

      switch (name) {
        case "send-welcome-push":
          content = await getNotificationContent({
            entityId: data?.entityId,
            channel: "push",
            event: "send-welcome-push",
            variables: variables,
          });
          break;

        case "booking-created-push":
          content = await getNotificationContent({
            entityId: data?.entityId,
            channel: "push",
            event: "booking-created-push",
            variables: { ...variables, bookingVariables },
          });
          break;

        case "saas-subscription-updated-push":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "push",
            event: "saas-subscription-updated-push",
            variables,
          });
          break;
        case "saas-subscription-created-push":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "push",
            event: "saas-subscription-created-push",
            variables,
          });
          break;

        case "saas-subscription-cancel-request-push":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "push",
            event: "saas-subscription-cancel-request-push",
            variables,
          });
          break;
        case "saas-subscription-renewed-push":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "push",
            event: "saas-subscription-renewed-push",
            variables,
          });
          break;
        case "saas-subscription-deleted-push":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "push",
            event: "saas-subscription-deleted-push",
            variables,
          });
          break;

        default:
          throw new Error(`Unknown job name: ${name}`);
      }
      if (content) {
        await send_push_notification(tokens, content.subject, content.body);
      }
    } catch (error) {
      console.log(error, "Eror from push worker");

      if (
        error?.errorInfo?.code === "messaging/registration-token-not-registered"
      ) {
        // console.warn(
        //   `Device token ${data.device_token} is no longer valid. Removing from DB.`
        // );

        return;
      }
      console.error(`Job ${job.id} with name ${name} failed.`, error.message);
      throw error;
    }
  },
  {
    connection,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  }
);

worker.on("Push Worker failed", (job, err) =>
  console.log(`Push Worker ${job.id} failed`, err)
);

module.exports = worker;
