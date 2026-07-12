import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/department.validator';

const router = Router();

// Reads are available to every authenticated role — other modules
// (Assets, Allocation, Booking, ...) need departments for dropdowns.
router.get('/', protect, departmentController.list);
router.get('/:id', protect, departmentController.getOne);

// Writes are Admin-only (Organization Setup).
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  validateBody(createDepartmentSchema),
  departmentController.create
);
router.patch(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateBody(updateDepartmentSchema),
  departmentController.update
);
router.delete('/:id', protect, authorize('ADMIN'), departmentController.remove);

export default router;
