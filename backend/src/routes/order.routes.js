import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';
import { orderSchema, orderStatusSchema } from '../schemas/order.schema.js';

const router = express.Router();

router.post(
  '/',
  rateLimiter({ windowMs: 60000, max: 10 }),
  validate(orderSchema),
  orderController.create
);

router.get('/', authenticate, requireAdmin, orderController.getAll);

router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  validate(orderStatusSchema),
  orderController.updateStatus
);

router.get(
  '/user/:userId',
  authenticate,
  requireAdmin,
  orderController.getByUserId
);

export default router;
