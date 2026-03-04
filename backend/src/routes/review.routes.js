import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { cache } from '../middleware/cache.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';
import { reviewSchema, reviewUpdateSchema } from '../schemas/review.schema.js';

const router = express.Router();

router.get('/', cache(300), reviewController.getAll);
router.get('/hero', cache(300), reviewController.getHeroReviews);
router.post('/', validate(reviewSchema), reviewController.create);
router.patch(
  '/:id/show-in-hero',
  authenticate,
  requireAdmin,
  validate(reviewUpdateSchema),
  reviewController.updateShowInHero
);

export default router;
