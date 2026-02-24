import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { cache } from '../middleware/cache.js';

const router = express.Router();

router.get('/', cache(300), reviewController.getAll);
router.post('/', reviewController.create);

export default router;
