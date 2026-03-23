import { Hono } from 'hono';
import * as categoryController from '../controllers/category.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { cache } from '../middleware/cache.js';
import { validate, validateId } from '../middleware/validate.js';
import {
  categorySchema,
  categoryUpdateSchema,
  categoryHomepageSchema,
} from '../schemas/category.schema.js';

const router = new Hono();

router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(categorySchema),
  categoryController.create
);
router.get('/', cache(600), categoryController.getAll);
router.get('/homepage', cache(600), categoryController.getHomepageCategories);
router.put(
  '/:id/homepage',
  authenticate,
  requireAdmin,
  validateId,
  validate(categoryHomepageSchema),
  categoryController.updateHomepageVisibility
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validateId,
  validate(categoryUpdateSchema),
  categoryController.update
);

export default router;
