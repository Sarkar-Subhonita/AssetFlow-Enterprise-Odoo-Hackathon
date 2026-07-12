// Business logic for Asset Categories (Organization Setup). Controllers
// call these functions and stay thin; these functions call the
// repository, never Prisma directly.
import { ApiError } from '../utils/ApiError';
import { logActivity } from '../utils/activityLog.util';
import {
  findAllCategories,
  findCategoryById,
  createCategory as createCategoryRepo,
  updateCategory as updateCategoryRepo,
  deleteCategory as deleteCategoryRepo,
  countAssetsInCategory,
} from '../repositories/category.repository';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export const listCategories = () => findAllCategories();

export const getCategory = async (id: string) => {
  const category = await findCategoryById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const createCategory = async (input: CreateCategoryInput, actorUserId: string) => {
  const category = await createCategoryRepo({
    name: input.name,
    customFields: input.customFields ?? undefined,
  });

  await logActivity({
    userId: actorUserId,
    action: 'CATEGORY_CREATE',
    entityType: 'AssetCategory',
    entityId: category.id,
    metadata: { name: category.name },
  });

  return category;
};

export const updateCategory = async (
  id: string,
  input: UpdateCategoryInput,
  actorUserId: string
) => {
  const existing = await findCategoryById(id);
  if (!existing) {
    throw new ApiError(404, 'Category not found');
  }

  const category = await updateCategoryRepo(id, {
    name: input.name,
    customFields: input.customFields,
  });

  await logActivity({
    userId: actorUserId,
    action: 'CATEGORY_UPDATE',
    entityType: 'AssetCategory',
    entityId: id,
    metadata: input,
  });

  return category;
};

export const deleteCategory = async (id: string, actorUserId: string) => {
  const existing = await findCategoryById(id);
  if (!existing) {
    throw new ApiError(404, 'Category not found');
  }

  const assetCount = await countAssetsInCategory(id);
  if (assetCount > 0) {
    throw new ApiError(409, 'This category has assets assigned to it and cannot be deleted');
  }

  await deleteCategoryRepo(id);

  await logActivity({
    userId: actorUserId,
    action: 'CATEGORY_DELETE',
    entityType: 'AssetCategory',
    entityId: id,
    metadata: { name: existing.name },
  });
};
