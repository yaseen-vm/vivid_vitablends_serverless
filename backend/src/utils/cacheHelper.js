import redisClient from './redis.js';
import config from '../config/index.js';
import logger from './logger.js';

export const getCached = async (key) => {
  if (!config.redisEnabled || !redisClient) return null;

  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    logger.error('Redis get error', { key, error: err.message });
    return null;
  }
};

export const setCached = async (key, value, ttl = config.redisTtl) => {
  if (!config.redisEnabled || !redisClient) return;

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.error('Redis set error', { key, error: err.message });
  }
};

export const deleteCached = async (key) => {
  if (!config.redisEnabled || !redisClient) return;

  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error('Redis delete error', { key, error: err.message });
  }
};

export const clearPattern = async (pattern) => {
  if (!config.redisEnabled || !redisClient) return;

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info('Cache cleared', { pattern, count: keys.length });
    }
  } catch (err) {
    logger.error('Redis clear pattern error', { pattern, error: err.message });
  }
};
