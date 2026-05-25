const amqp = require('amqplib');

let connection = null;
let channel = null;

const connect = async () => {
  if (channel) return channel;
  connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
  });
  channel = await connection.createChannel();
  await channel.assertQueue('applications', { durable: true });
  return channel;
};

const publish = async (queue, message) => {
  const ch = await connect();
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

module.exports = { connect, publish };