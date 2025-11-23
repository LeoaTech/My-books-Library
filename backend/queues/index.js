const { Queue } = require("bullmq");
const { connection } = require("../config/redisConfig.js");

//  queues for each notification channel
const emailQueue = new Queue("email-notifications", { connection });
const inAppQueue = new Queue("inapp-notifications", { connection });
const pushQueue = new Queue("push-notifications", { connection });

module.exports = { emailQueue, inAppQueue, pushQueue };
