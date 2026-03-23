const rateLimiter = (options = {}) => {
  const {
    windowMs = 60000, // 1 minute
    max = 100, // max requests per window
    message = 'Too many requests, please try again later',
  } = options;

  return async (c, next) => {
    if (!c.env.KV) {
      return await next();
    }

    const ip = c.req.header('cf-connecting-ip') || 'unknown';
    const path = new URL(c.req.url).pathname;
    const key = `rate_limit:${ip}:${path}`;

    try {
      const current = await c.env.KV.get(key);
      const count = current ? parseInt(current) + 1 : 1;

      if (count > max) {
        return c.json(
          {
            success: false,
            message,
            code: 'RATE_LIMIT_EXCEEDED',
          },
          429
        );
      }

      const ttl = Math.max(60, Math.ceil(windowMs / 1000));
      // Run the put operation in the background
      c.executionCtx.waitUntil(
        c.env.KV.put(key, count.toString(), { expirationTtl: ttl }).catch(
          console.error
        )
      );

      await next();
    } catch (error) {
      console.error('Rate limiter error', error);
      await next();
    }
  };
};

export default rateLimiter;
