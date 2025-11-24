const { Worker } = require('bullmq');
const send_email = require('../utils/sendEmail.js');
const { connection } = require('../config/redisConfig.js');

const QUEUE_NAME = 'email-notifications';

const processEmailQueue = () => {

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const { name, data } = job;

        switch (name) {
          case 'send-welcome-email':
          case 'send-customer-welcome-email':  
            await send_email(data.email, "Welcome Email", `Hi ${data.name}, Welcome to your library`);
            break;
          case 'subscription-created-email':
            break;
          default:
            throw new Error(`Unknown job name: ${name}`);
        }
      },
      {
        connection,
        concurrency: 5, 
        limiter: { max: 100, duration: 60000 },
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        }
      }
    );

    worker.on('drained', async () => {
      console.log('Email queue is drained. Closing worker.');
      await worker.close(); 
      resolve(); 
    });

    worker.on('failed', (job, error) => {
      console.error(`Job ${job?.id} of type ${job?.name} failed with error: ${error.message}`);
    });

    worker.on('error', (err) => {
      console.error('An error occurred in the email worker:', err);
      reject(err); 
    });

    (async () => {
      const waitingCount = await worker.getWaitingCount();
      const activeCount = await worker.getActiveCount();
      if (waitingCount === 0 && activeCount === 0) {
        console.log('Email queue is empty. Closing worker.');
        await worker.close();
        resolve();
      }
    })();
  });
};

module.exports = { processEmailQueue };