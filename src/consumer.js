const amqp = require('amqplib');
const { MongoClient } = require('mongodb');

// Parse JSON if possible; otherwise return null
function toJsonOrNull(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

// Format a local timestamp based on TZ (defaults to UTC)
function formatLocalTimestamp(date, tz) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(',', '');
}

async function subscribeAndLog({ amqpUrl, queue, mongoUri, dbName, collectionName }) {
  const tz = process.env.TZ || 'UTC';

  try {
    // Connect to MongoDB
    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const collection = mongoClient.db(dbName).collection(collectionName);
    console.log('[MongoDB] Connected');
    console.log(`[Timezone] Using TZ=${tz}`);

    // Connect to RabbitMQ
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    console.log(`[RabbitMQ] Listening on queue: ${queue}`);

    // Handle incoming messages
    const onMessage = async (msg) => {
      if (!msg) return;

      try {
        const raw = msg.content.toString();
        const parsed = toJsonOrNull(raw);
        console.log('[Received]', parsed ?? raw);

        const now = new Date();
        await collection.insertOne({
          message: parsed, // keep schema: JSON object if parsable, otherwise null
          receivedAt: now,
          receivedAtLocal: formatLocalTimestamp(now, tz),
          tz,
        });

        channel.ack(msg);
      } catch (err) {
        console.error('[Consume Error]', err);
        // Do not ack on error so the message can be retried
      }
    };

    channel.consume(queue, onMessage);
  } catch (err) {
    console.error('[Error]', err);
  }
}

module.exports = { subscribeAndLog };