import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  headUserId: z.string().uuid('Invalid user id').nullable().optional(),
  parentDepartmentId: z.string().uuid('Invalid department id').nullable().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  headUserId: z.string().uuid('Invalid user id').nullable().optional(),
  parentDepartmentId: z.string().uuid('Invalid department id').nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
