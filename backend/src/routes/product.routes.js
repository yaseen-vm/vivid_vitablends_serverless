import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { cache } from '../middleware/cache.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';
import {
  productSchema,
  productUpdateSchema,
} from '../schemas/product.schema.js';

const router = express.Router();

router.get('/featured', cache(300), productController.getFeatured);
router.get('/combos', cache(300), productController.getCombos);
router.get('/:id', cache(600), productController.getById);
router.get('/', cache(300), productController.getAll);
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(productSchema),
  productController.create
);
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(productUpdateSchema),
  productController.update
);
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  productController.deleteProduct
);

export default router;
