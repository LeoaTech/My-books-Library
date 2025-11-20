const IORedis = require("ioredis");
require("dotenv").config();
const connection = new IORedis(process.env.UPSTASH_REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});


module.exports ={connection}