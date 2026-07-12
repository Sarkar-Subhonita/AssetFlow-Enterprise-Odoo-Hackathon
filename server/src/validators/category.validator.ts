import { z } from 'zod';

// customFields is a free-form schema definition for the category, e.g.
// { "warrantyMonths": "number", "vendor": "string" }. We only require
// that it be a plain object if provided — the shape itself is up to the admin.
const customFieldsSchema = z.record(z.any()).nullable().optional();

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  customFields: customFieldsSchema,
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  customFields: customFieldsSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
