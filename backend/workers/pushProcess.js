const {  Worker } = require("bullmq");
const connection = require("../config/redisConfig.js");
const {
  send_push_notification,
} = require("../utils/send_push_notification.js");


const QUEUE_NAME = "push-notifications";

const processPushQueue = () => {

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const { name, data } = job;
        switch (name) {
          case "send-welcome-push":
            response = await send_push_notification(
              data.tokens,
              "Welcome!",
              `Hi ${data.name}, welcome to your library`
            );
            break;
          case "send-booking-create-push":
            response = await send_push_notification(
              data.tokens,
              "Congratulations!",
              `Hi ${data.name}, Your booking is created successfully!`
            );
            break;
          default:
            throw new Error(`Unknown job name: ${name}`);
        }
      },
      {
        connection: connection,
        concurrency: 10,
        limiter: {
          max: 200,
          duration: 60000,
        },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      }
    );

    worker.on("drained", async () => {
      console.log("Push queue is processed completely. Closing worker.");
      await worker.close();
      resolve();
    });

    worker.on("failed", (job, error) => {
      console.error(`Job ${job.id} failed with error: ${error.message}`);
    });

    worker.on("error", (err) => {
      console.error("An error occurred in the worker:", err);
      reject(err);
    });

    (async () => {
      const jobs = await (await worker.client).llen(worker.toKey("wait"));
      if (jobs === 0) {
        console.log("Queue is Empty. Shutdown worker.");
        await worker.close();
        resolve();
      }
    })();
  });
};

module.exports = { processPushQueue };
