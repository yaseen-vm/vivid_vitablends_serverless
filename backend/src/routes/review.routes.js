import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { cache } from '../middleware/cache.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validate, validateQuery, validateId } from '../middleware/validate.js';
import {
  reviewSchema,
  reviewUpdateSchema,
  reviewQuerySchema,
} from '../schemas/review.schema.js';

const router = express.Router();

router.get(
  '/',
  cache(300),
  validateQuery(reviewQuerySchema),
  reviewController.getAll
);
router.get('/hero', cache(300), reviewController.getHeroReviews);
router.post('/', validate(reviewSchema), reviewController.create);
router.patch(
  '/:id/show-in-hero',
  authenticate,
  requireAdmin,
  validateId,
  validate(reviewUpdateSchema),
  reviewController.updateShowInHero
);

export default router;
