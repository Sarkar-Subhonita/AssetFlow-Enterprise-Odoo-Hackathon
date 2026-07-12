import { Router } from 'express';
import * as adminUserController from '../controllers/admin-user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import {
  updateRoleSchema,
  updateStatusSchema,
  updateDepartmentAssignmentSchema,
} from '../validators/admin-user.validator';

const router = Router();

// Employee Directory + Role Promotion are entirely Admin-only.
router.use(protect, authorize('ADMIN'));

router.get('/', adminUserController.list);
router.get('/:id', adminUserController.getOne);
router.patch('/:id/role', validateBody(updateRoleSchema), adminUserController.updateRole);
router.patch('/:id/status', validateBody(updateStatusSchema), adminUserController.updateStatus);
router.patch(
  '/:id/department',
  validateBody(updateDepartmentAssignmentSchema),
  adminUserController.updateDepartment
);

export default router;
