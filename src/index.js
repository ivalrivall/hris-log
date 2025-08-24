require('dotenv').config();
const { subscribeAndLog } = require('./consumer');

subscribeAndLog({
  amqpUrl: process.env.AMQP_URL,
  queue: process.env.AMQP_QUEUE,
  mongoUri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB,
  collectionName: process.env.MONGO_COLLECTION,
});
