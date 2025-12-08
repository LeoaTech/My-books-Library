require('dotenv').config(); 
const { connection } = require('../config/redisConfig'); 


const emailWorker = require('./emailWorker');

const gracefulShutdown = async () => {
  console.log('SIGTERM received. Closing workers...');
  
  await emailWorker.close();

  
  console.log('Workers closed. Exiting.');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);