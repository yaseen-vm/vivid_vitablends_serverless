import logger from '../utils/logger.js';

export const requestLogger = async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  logger.info('API Request', {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: `${duration}ms`,
    ip: c.req.header('cf-connecting-ip') || 'unknown',
  });
};
