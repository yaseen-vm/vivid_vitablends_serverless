import express from 'express';
import * as messageController from '../controllers/message.controller.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { messageSchema } from '../schemas/message.schema.js';

const router = express.Router();

router.post(
  '/',
  rateLimiter({ windowMs: 60000, max: 5 }),
  validate(messageSchema),
  messageController.create
);
router.get('/', messageController.getAll);

export default router;
