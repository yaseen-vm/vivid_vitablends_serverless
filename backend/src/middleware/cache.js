import redisClient from '../utils/redis.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

export const cache = (ttl = config.redisTtl) => {
  return async (req, res, next) => {
    if (!config.redisEnabled || !redisClient) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        logger.info('Cache HIT', { key });
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cached));
      }

      logger.info('Cache MISS', { key });
      res.setHeader('X-Cache', 'MISS');

      res.sendResponse = res.json;
      res.json = async (body) => {
        try {
          await redisClient.setEx(key, ttl, JSON.stringify(body));
        } catch (err) {
          logger.error('Redis setEx cache error', { key, error: err });
        }
        res.sendResponse(body);
      };

      next();
    } catch (err) {
      logger.error('Redis cache error', err);
      next();
    }
  };
};

export const clearCache = async (pattern = '*') => {
  if (!config.redisEnabled || !redisClient) {
    return;
  }

  try {
    let cursor = 0;
    let totalDeleted = 0;
    const matchPattern = `cache:${pattern}`;

    do {
      // Use SCAN to iterate over keys matching the cache pattern in a non-blocking way
      const [nextCursor, foundKeys] = await redisClient.scan(cursor, {
        MATCH: matchPattern,
        COUNT: 100,
      });

      cursor = Number(nextCursor);

      if (Array.isArray(foundKeys) && foundKeys.length > 0) {
        await redisClient.del(foundKeys);
        totalDeleted += foundKeys.length;
      }
    } while (cursor !== 0);

    if (totalDeleted > 0) {
      logger.info('Cache cleared', { pattern, count: totalDeleted });
    }
  } catch (err) {
    logger.error('Redis clear cache error', err);
  }
};
