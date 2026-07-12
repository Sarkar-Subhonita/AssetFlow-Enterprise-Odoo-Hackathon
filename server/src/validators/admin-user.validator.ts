import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(['EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN']),
});

export const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const updateDepartmentAssignmentSchema = z.object({
  departmentId: z.string().uuid('Invalid department id').nullable(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdateDepartmentAssignmentInput = z.infer<typeof updateDepartmentAssignmentSchema>;
