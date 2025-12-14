const SYSTEM_DEFAULTS = {
  //From Library Saas App to Client
  "saas-signup-welcome": {
    subject: "Welcome to {{saas_app_name}} - Let's set up your library",
    body: "Hi {{customer_name}},\n\nWelcome to {{saas_app_name}}! We are thrilled to help you digitize your library.\n\nTo get started:\n1. Go to Dashboard and Complete your profile\n2. Add your first book\n3. Set up your pricing plans\n\n[Link: Read our Setup Guide]\n\nNeed help? Reply to this email or contact {{saas_support_email}}.",
    variables: ["customer_name", "saas_app_name", "saas_support_email"],
    channel: "email",
  },
  "saas-subscription-created": {
    subject: "Upgrade Confirmed: You are now on the {{plan_name}} Plan",
    body: "Hi {{customer_name}},\n\nSuccess! You have upgraded your library to the {{plan_name}}.\n\nBilling Cycle: {{billing_cycle}}\nAmount: {{amount}}\n\nYou now have access to {{plan_name}} features.\n\nView Invoice: {{invoice_link}}",
    variables: [
      "customer_name",
      "plan_name",
      "billing_cycle",
      "amount",
      "invoice_link",
    ],
    channel: "email",
  },
  "saas-subscription-created-push": {
    subject: "Upgrade Confirmed: You are now on the {{plan_name}} Plan",
    body: "Hi {{customer_name}},\n\nSuccess! You have upgraded your library to the {{plan_name}}.\n\nView Invoice: {{invoice_link}}",
    variables: [
      "customer_name",
      "plan_name",
      "billing_cycle",
      "amount",
      "invoice_link",
    ],
    channel: "push",
  },

  "saas-subscription-updated": {
    subject: "Your Subscription Plan has been Updated",
    body: "Hi {{customer_name}},\n\nYour subscription has been successfully updated to the {{plan_name}} plan.\n\nSince this change happened mid-cycle, you may see a prorated adjustment on your next invoice.\n\nNew Amount: {{amount}}\n\nBest wishes: {{saas_support_email}}",
    variables: ["customer_name", "plan_name", "amount", "saas_support_email"],
    channel: "email",
  },

  "saas-subscription-updated-push": {
    subject: "Your Subscription Plan has been Updated",
    body: "Hi {{customer_name}},\n\nYour subscription has been successfully updated to the {{plan_name}} plan.",
    variables: ["customer_name", "plan_name"],
    channel: "push",
  },

  "saas-subscription-cancel-request": {
    subject: "Subscription Cancellation Request",
    body: "Hi {{customer_name}},\n\nWe have received your request to cancel your subscription.\n\nYour access to paid features will continue until the end of your current billing period on {{end_date}}.\n\nWe are sorry to see you go. If this was a mistake, you can resubscribe at any time.",
    variables: ["customer_name", "end_date"],
    channel: "email",
  },
 "saas-subscription-cancel-request-push": {
    subject: "Subscription Cancellation Request",
    body: "Hi {{customer_name}},\n\nWe are sorry to see you go.\n\nIf this was a mistake, you can resubscribe at any time before {{end_date}}.",
    variables: ["customer_name", "end_date"],
    channel: "push",
  },
  "saas-subscription-deleted": {
    subject: "Your Subscription Has Ended",
    body: "Hi {{customer_name}},\n\nYour subscription has officially ended and your account has been downgraded to the Free plan.\n\nWe hope you enjoyed using our service. You can upgrade again at any time to regain access to premium features.\n\nBest regards,\nThe Team {{saas_app_name}}",
    variables: ["customer_name", "saas_app_name"],
    channel: "email",
  },

  "saas-subscription-renewed": {
    subject: "Subscription Renewal Successful",
    body: "Hi {{customer_name}},\n\nThis is a confirmation that your subscription for {{plan_name}} has been successfully renewed.\n\nAmount Paid: ${{amount}}\nNext Billing Date: {{next_billing_date}}\n\nThank you for continuing with us!",
    variables: ["customer_name", "plan_name", "amount", "next_billing_date"],
    channel: "email",
  },

  // From Client Library to its Customers
  "send-welcome-email": {
    subject: "Welcome to {{library_name}}!",
    body: "Hi {{customer_name}},\n\nWelcome to {{library_name}}! We are excited to have you. Start exploring our collection of books.\n\nIf you have questions, contact us at {{contact}}.\n\nHappy Reading!",
    variables: ["customer_name", "library_name", "contact", "email"],
    channel: "email",
  },
  "send-welcome-push": {
    subject: "Welcome to {{library_name}}!",
    body: "Hi {{customer_name}},\n\nWelcome to {{library_name}}!",
    variables: ["customer_name", "library_name"],
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
