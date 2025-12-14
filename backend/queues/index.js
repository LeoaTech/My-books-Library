const { Queue } = require("bullmq");
const { connection } = require("../config/redisConfig.js");

//  queues for each notification channel
const emailQueue = new Queue("email-notifications", { connection, defaultJobOptions:{
    removeOnComplete:true,
    removeOnFail:1000
} });
const inAppQueue = new Queue("inapp-notifications", { connection, defaultJobOptions:{
    removeOnComplete:true,
    removeOnFail:1000
} });
const pushQueue = new Queue("push-notifications", { connection, defaultJobOptions:{
    removeOnComplete:true,
    removeOnFail:1000
} });

module.exports = { emailQueue, inAppQueue, pushQueue };
