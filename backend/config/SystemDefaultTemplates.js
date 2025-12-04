const SYSTEM_DEFAULTS = {
  "send-welcome-email": {
    subject: "Welcome to {{library_name}}!",
    body: "Hi {{customer_name}},\n\nWelcome to {{library_name}}! We are excited to have you start exploring our collection of books.\n\nIf you have questions, contact us at {{phone}}.\n\nHappy Reading!",
    variables: ["customer_name", "library_name", "phone", "email"],
    channel: "email",
  },
  "send-welcome-push": {
    subject: "Welcome to {{library_name}}!",
    body: "Hi {{customer_name}},\n\nWelcome to {{library_name}}!",
    variables: ["customer_name", "library_name", "phone", "email"],
    channel: "push",
  },
  "booking-created-email": {
    subject: "Booking Confirmed",
    body: "Hi {{customer_name}},\n\nYour booking (ID: {{booking_id}}) is confirmed. Please pick it up at {{address}}.\n\nThanks!",
    variables: ["customer_name", "booking_id", "address"],
    channel: "email",
  },
  "booking-created-push": {
    subject: "Booking Confirmed",
    body: "Hi {{customer_name}},\n\nYour booking (ID: {{booking_id}}) is confirmed.Thanks for Shopping!",
    variables: ["customer_name", "booking_id"],
    channel: "push",
  },
  "subscription-created-email": {
    subject: "Subscription Created : {{subscription_id}}",
    body: "Hi {{customer_name}}, \n\n Thanks for Purchasing. Your Subscription for ID {{subscription_id}} created successfully. You can use the {{plan_name}} features",
    variables: ["customer_name", "plan_name", "subscription_id"],
    channel: "email",
  },
  "subscription-created-push": {
    subject: "Subscription Created : {{subscription_id}}",
    body: "Hi {{customer_name}}, \n\n Thanks for Purchasing. Your Subscription for ID {{subscription_id}} created successfully. You can use the {{plan_name}} features",
    variables: ["customer_name", "plan_name", "subscription_id"],
    channel: "push",
  },
  "subscription-updated-email": {
    subject: "Subscription Updated : {{subscription_id}}",
    body: "Hi {{customer_name}}, \n\n Thanks for Subscribing again. Your Subscription for ID {{subscription_id}} updated successfully. Enjoy Your Reading!",
    variables: ["customer_name", "booking_title", "booking_id", "address"],
    channel: "email",
  },
  "subscription-updated-push": {
    subject: "Subscription Updated : {{subscription_id}}",
    body: "Hi {{customer_name}}, \n\n Thanks for Subscribing again. Your Subscription for ID {{subscription_id}} updated successfully. Enjoy Your Reading!",
    variables: ["customer_name", "plan_name", "subscription_id"],
    channel: "push",
  },
};

module.exports = SYSTEM_DEFAULTS;
