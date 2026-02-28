import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticate } from '../middleware/auth.js';
import { cache } from '../middleware/cache.js';

const router = express.Router();

router.post('/', authenticate, categoryController.create);
router.get('/', cache(600), categoryController.getAll);

export default router;
