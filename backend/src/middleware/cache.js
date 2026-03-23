import { getHonoContext } from '../utils/context.js';

export const cache = (ttl = 3600) => {
  return async (c, next) => {
    if (!c.env.KV) {
      return await next();
    }

    const url = new URL(c.req.url);
    const key = `cache:${c.req.method}:${url.pathname}${url.search}`;

    try {
      const cached = await c.env.KV.get(key);
      if (cached) {
        c.header('X-Cache', 'HIT');
        return c.json(JSON.parse(cached));
      }

      c.header('X-Cache', 'MISS');

      await next();

      if (c.res.ok) {
        // Clone response to read body for caching
        const clonedRes = c.res.clone();
        const body = await clonedRes.text();
        const expirationTtl = Math.max(60, ttl);
        c.executionCtx.waitUntil(
          c.env.KV.put(key, body, { expirationTtl }).catch(console.error)
        );
      }
    } catch (err) {
      console.error('KV cache error', err);
      await next();
    }
  };
};

export const clearCache = async (pattern = '') => {
  const c = getHonoContext();
  if (!c || !c.env.KV) return;

  try {
    const prefix = `cache:${pattern}`;
    let listComplete = false;
    let cursor = undefined;

    while (!listComplete) {
      const list = await c.env.KV.list({ prefix, cursor });
      for (const key of list.keys) {
        await c.env.KV.delete(key.name);
      }
      listComplete = list.list_complete;
      cursor = list.cursor;
    }
  } catch (err) {
    console.error('KV clear cache error', err);
  }
};
