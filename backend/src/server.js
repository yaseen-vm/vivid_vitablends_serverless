import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import logger from './utils/logger.js';
import { initRedis } from './utils/redis.js';
import { requestLogger } from './middleware/requestLogger.js';
import healthRoutes from './routes/health.js';
import adminRoutes from './routes/admin.routes.js';
import productRoutes from './routes/product.routes.js';
import reviewRoutes from './routes/review.routes.js';
import orderRoutes from './routes/order.routes.js';
import messageRoutes from './routes/message.routes.js';
import categoryRoutes from './routes/category.routes.js';

const app = express();

initRedis().catch((err) => {
  logger.error('Redis initialization failed, continuing without cache', err);
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://pub-*.r2.dev'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

initRedis().catch((err) => {
  logger.error('Redis initialization failed, continuing without cache', err);
});

app.set('etag', false);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = config.corsOrigin.split(',').map((o) => o.trim());

      // Block wildcard in production
      if (allowedOrigins.includes('*') && config.nodeEnv === 'production') {
        logger.error('CORS wildcard not allowed in production');
        return callback(new Error('Invalid CORS configuration'));
      }

      if (
        !origin ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        logger.warn('CORS origin rejected', { origin, allowedOrigins });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(requestLogger);

app.use('/api', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', healthRoutes);

app.use((err, req, res, next) => {
  logger.error('Request failed', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  const message =
    config.nodeEnv === 'production' && !err.statusCode
      ? 'An error occurred'
      : err.message;

  res.status(err.statusCode || 500).json({
    success: false,
    message,
    code: err.code || 'INTERNAL_ERROR',
    ...(err.errors && { errors: err.errors }),
  });
});

app.listen(config.port, () => {
  logger.info(
    `Server running on port ${config.port} in ${config.nodeEnv} mode`
  );
});
