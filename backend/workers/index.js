require("dotenv").config();
const { connection } = require("../config/redisConfig");

const emailWorker = require("./emailWorker");
const pushWorker = require("./pushWorker");
const gracefulShutdown = async () => {
  console.log("Closing workers...");

  await emailWorker.close();
  await pushWorker.close();

  console.log("Workers closed. Exiting.");
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
