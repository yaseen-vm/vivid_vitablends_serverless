import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, refreshSchema } from '../schemas/admin.schema.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/login',
  rateLimiter({ windowMs: 60000, max: 5, message: 'Too many login attempts' }),
  validate(loginSchema),
  adminController.login
);
router.post(
  '/refresh',
  rateLimiter({ windowMs: 60000, max: 10 }),
  validate(refreshSchema),
  adminController.refresh
);
router.post('/logout', authenticate, adminController.logout);

export default router;
