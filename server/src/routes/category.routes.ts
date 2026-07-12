import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

// Reads are available to every authenticated role — Asset registration
// (a later phase) needs categories for its dropdown.
router.get('/', protect, categoryController.list);
router.get('/:id', protect, categoryController.getOne);

// Writes are Admin-only (Organization Setup).
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  validateBody(createCategorySchema),
  categoryController.create
);
router.patch(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateBody(updateCategorySchema),
  categoryController.update
);
router.delete('/:id', protect, authorize('ADMIN'), categoryController.remove);

export default router;
