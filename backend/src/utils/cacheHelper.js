// Simple cache helper using Cloudflare KV via Hono Context
export const getCached = async (c, key) => {
  if (!c.env.KV) return null;
  try {
    const cached = await c.env.KV.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error('KV get error', { key, error: err.message });
    return null;
  }
};

export const setCached = async (c, key, value, ttl = 3600) => {
  if (!c.env.KV) return;
  try {
    // KV expirationTtl must be at least 60 seconds
    const expirationTtl = Math.max(60, ttl);
    await c.env.KV.put(key, JSON.stringify(value), { expirationTtl });
  } catch (err) {
    console.error('KV set error', { key, error: err.message });
  }
};

export const deleteCached = async (c, key) => {
  if (!c.env.KV) return;
  try {
    await c.env.KV.delete(key);
  } catch (err) {
    console.error('KV delete error', { key, error: err.message });
  }
};

export const clearPattern = async (c, pattern) => {
  if (!c.env.KV) return;
  try {
    const prefix = pattern.replace('*', '');
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
    console.error('KV clear pattern error', { pattern, error: err.message });
  }
};
