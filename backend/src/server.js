import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger as honoLogger } from 'hono/logger';
import config from './config/index.js';
import logger from './utils/logger.js';
import { requestLogger } from './middleware/requestLogger.js';

import healthRoutes from './routes/health.js';
import adminRoutes from './routes/admin.routes.js';
import productRoutes from './routes/product.routes.js';
import reviewRoutes from './routes/review.routes.js';
import orderRoutes from './routes/order.routes.js';
import messageRoutes from './routes/message.routes.js';
import categoryRoutes from './routes/category.routes.js';
import comingSoonRoutes from './routes/comingSoon.routes.js';

const app = new Hono();

app.use('*', honoLogger());
app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://pub-*.r2.dev'],
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim());
      if (allowedOrigins.includes('*') && config.nodeEnv === 'production') {
        return null;
      }
      if (
        !origin ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin)
      ) {
        return origin;
      }
      return null;
    },
    credentials: true,
  })
);

app.use('*', requestLogger);

// Initialize Prisma D1 Adapter per request using context
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { prismaContext } from './utils/prisma.js';
import { honoContext } from './utils/context.js';

app.use('*', async (c, next) => {
  if (c.env?.DB) {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    return honoContext.run(c, () => prismaContext.run(prisma, () => next()));
  }
  return honoContext.run(c, () => next());
});

app.route('/api', healthRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/products', productRoutes);
app.route('/api/reviews', reviewRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/messages', messageRoutes);
app.route('/api/categories', categoryRoutes);
app.route('/api/coming-soon', comingSoonRoutes);
app.route('/', healthRoutes);

app.onError((err, c) => {
  logger.error('Request failed', {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
  });

  const message =
    config.nodeEnv === 'production' && !err.statusCode
      ? 'An error occurred'
      : err.message;

  return c.json(
    {
      success: false,
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(err.errors && { errors: err.errors }),
    },
    err.statusCode || 500
  );
});

export default app;
