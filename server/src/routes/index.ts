import { Router } from 'express';
import authRoutes from './auth.routes';
import departmentRoutes from './department.routes';
import categoryRoutes from './category.routes';
import adminUserRoutes from './admin-user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin/users', adminUserRoutes);

export default router;
