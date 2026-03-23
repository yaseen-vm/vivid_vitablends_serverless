import { getHonoContext } from '../utils/context.js';

const getEnv = (key, fallback) => {
  const c = getHonoContext();
  if (c && c.env && c.env[key] !== undefined) {
    return c.env[key];
  }
  return fallback;
};

export default {
  get port() {
    return getEnv('PORT', 5000);
  },
  get nodeEnv() {
    return getEnv('NODE_ENV', 'development');
  },
  get corsOrigin() {
    return getEnv(
      'CORS_ORIGIN',
      'http://localhost:8081,https://vivid-vitablends-frontend-prod.pages.dev'
    );
  },
  get jwtSecret() {
    return getEnv('JWT_SECRET', 'your-secret-key-change-in-production');
  },
  get jwtExpiresIn() {
    return getEnv('JWT_EXPIRES_IN', '15m');
  },
  get jwtRefreshSecret() {
    return getEnv(
      'JWT_REFRESH_SECRET',
      'your-refresh-secret-key-change-in-production'
    );
  },
  get jwtRefreshExpiresIn() {
    return getEnv('JWT_REFRESH_EXPIRES_IN', '7d');
  },

  refreshTokenCookieName: 'refreshToken',
  refreshTokenCookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms

  get redisEnabled() {
    return getEnv('REDIS_ENABLED', 'true') === 'true';
  },
  get redisUrl() {
    return getEnv('REDIS_URL', 'redis://localhost:6379');
  },
  get redisPassword() {
    return getEnv('REDIS_PASSWORD', '');
  },
  get redisTtl() {
    return parseInt(getEnv('REDIS_TTL', '3600'), 10);
  },

  r2: {
    get accountId() {
      return getEnv('R2_ACCOUNT_ID', '');
    },
    get accessKeyId() {
      return getEnv('R2_ACCESS_KEY_ID', '');
    },
    get secretAccessKey() {
      return getEnv('R2_SECRET_ACCESS_KEY', '');
    },
    get bucketName() {
      return getEnv('R2_BUCKET_NAME', '');
    },
    get publicBucketId() {
      return getEnv('R2_PUBLIC_BUCKET_ID', '');
    },
    pathPrefix: 'products/',
  },
};
