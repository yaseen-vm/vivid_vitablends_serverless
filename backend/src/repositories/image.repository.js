import { getHonoContext } from '../utils/context.js';
import config from '../config/index.js';

export const uploadToS3 = async (buffer, key, contentType = 'image/jpeg') => {
  const c = getHonoContext();
  if (!c || !c.env.R2_BUCKET) {
    throw Object.assign(
      new Error('R2 Bucket binding not initialized in context'),
      {
        statusCode: 503,
        code: 'R2_BUCKET_NOT_INITIALIZED',
      }
    );
  }

  await c.env.R2_BUCKET.put(key, buffer, {
    httpMetadata: { contentType },
  });
};
