"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

// Promisify Redis commands
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Acquire pessimistic lock
async function acquireLock(lockKey, lockValue, expiryTime) {
  const result = await setAsync(lockKey, lockValue, "NX", "PX", expiryTime);
  return result === "OK";
}

// Release pessimistic lock
async function releaseLock(lockKey, lockValue) {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  const result = await redisClient.eval(script, 1, lockKey, lockValue);
  return result === 1;
}

module.exports = {
  acquireLock,
  releaseLock,
};
