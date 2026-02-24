import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/',
  rateLimiter({ windowMs: 60000, max: 10 }),
  orderController.create
);

export default router;
