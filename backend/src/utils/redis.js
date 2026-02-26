import { createClient } from 'redis';
import logger from './logger.js';
import config from '../config/index.js';

let redisClient = null;

export const initRedis = async () => {
  if (config.redisEnabled) {
    try {
      redisClient = createClient({ url: config.redisUrl });
      redisClient.on('error', (err) => logger.error('Redis Client Error', err));
      redisClient.on('connect', () => logger.info('Redis Client Connected'));
      await redisClient.connect();
    } catch (err) {
      logger.error('Failed to connect to Redis, continuing without cache', err);
      redisClient = null;
    }
  } else {
    logger.info('Redis is disabled');
  }
};

export default redisClient;
