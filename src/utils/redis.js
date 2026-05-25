const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379,
  }
});

client.on('error', (err) => console.error('Redis error:', err));

client.connect();

module.exports = client;