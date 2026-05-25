const redis = require('./redis');

const CACHE_TTL = 3600; // 1 jam

const get = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const set = async (key, value) => {
  await redis.setEx(key, CACHE_TTL, JSON.stringify(value));
};

const del = async (...keys) => {
  for (const key of keys) {
    await redis.del(key);
  }
};

module.exports = { get, set, del };