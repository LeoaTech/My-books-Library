const { Worker } = require("bullmq");
const send_email = require("../utils/sendEmail");
const { connection } = require("../config/redisConfig.js");
const { getNotificationContent } = require("../utils/templatesHandler.js");

const worker = new Worker(
  "email-notifications",
  async (job) => {
    const { name, data } = job;
    const { userData } = data;

    try {
      const variables = {
        customer_name: userData?.name || "User",
        library_name: userData?.entity_name || userData?.subdomain || "Library",
        entityId: userData?.entity_id || data?.entityId,
        email: userData?.email,
        phone: userData?.phone || "",
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
        case "send-welcome-email":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "send-welcome-email",
            variables,
          });
          break;
        case "saas-signup-welcome":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "saas-signup-welcome",
            variables,
          });
          break;
        case "booking-created-email":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "booking-created-email",
            variables: { ...variables, ...bookingVariables },
          });
          break;
        case "saas-subscription-created":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "saas-subscription-created",
            variables,
          });
          break;
        case "saas-subscription-updated":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "saas-subscription-updated",
            variables,
          });
          break;

        case "saas-subscription-cancel-request":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "saas-subscription-cancel-request",
            variables,
          });
          break;
        case "saas-subscription-deleted":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "saas-subscription-deleted",
            variables,
          });
          break;
        case "saas-subscription-renewed":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "saas-subscription-renewed",
            variables,
          });
          break;
        case "send-book-available-email":
          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "send-book-available-email",
            variables: { ...variables, book_title: data?.book_title },
          });
          break;
        case "booking-due-reminder-email":
          const bookItems = data?.books?.map(b => `- ${b.title} (due Date: ${b.due_date})`).join('\n') || '';

          content = await getNotificationContent({
            entityId: variables?.entityId || data?.entityId,
            channel: "email",
            event: "booking-due-reminder-email",
            variables: { 
              ...variables, 
              book_title: data?.book_title, 
              due_date: data?.due_date,
              books: data?.books 
            },
          });
          break;
        case "fine-payment-reminder-email":
            const booksList = data?.books?.map(b => `- ${b.title} (Fine: ${b.fine})`).join('\n') || '';
            
            content = await getNotificationContent({
              entityId: variables?.entityId || data?.entityId,
              channel: "email",
              event: "fine-payment-reminder-email",
              variables: { 
                ...variables,
                books_list: booksList,
                total_fine: data?.total_fine
              },
            });
            break;
        default:
          throw new Error(`Unknown job name: ${name}`);
      }

      // Send the email
      if (content) {
        await send_email(data?.to, content.subject, content.body);
      }
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error.message);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
    attempts: 5,
    backoff: { type: "exponential", delay: 5000 },
  }
);

worker.on("failed", (job, err) => console.log(`${job.id} failed`, err));

module.exports = worker;
