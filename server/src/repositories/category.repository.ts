// All direct Prisma access for AssetCategory lives here. Services never
// import prisma directly for category data — they go through this repo.
import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

const categoryListSelect = {
  id: true,
  name: true,
  customFields: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { assets: true } },
} as const;

export const findAllCategories = () =>
  prisma.assetCategory.findMany({
    select: categoryListSelect,
    orderBy: { name: 'asc' },
  });

export const findCategoryById = (id: string) =>
  prisma.assetCategory.findUnique({
    where: { id },
    select: categoryListSelect,
  });

// Prisma represents an explicit JSON "set to null" differently from
// "field not provided" — Prisma.JsonNull vs undefined. This converts our
// simpler null | undefined | value shape into what Prisma expects.
const toJsonInput = (value: Prisma.InputJsonValue | null | undefined) => {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value;
};

export const createCategory = (data: { name: string; customFields?: Prisma.InputJsonValue | null }) =>
  prisma.assetCategory.create({
    data: { name: data.name, customFields: toJsonInput(data.customFields) },
    select: categoryListSelect,
  });

export const updateCategory = (
  id: string,
  data: { name?: string; customFields?: Prisma.InputJsonValue | null }
) =>
  prisma.assetCategory.update({
    where: { id },
    data: { name: data.name, customFields: toJsonInput(data.customFields) },
    select: categoryListSelect,
  });

export const deleteCategory = (id: string) => prisma.assetCategory.delete({ where: { id } });

export const countAssetsInCategory = (id: string) => prisma.asset.count({ where: { categoryId: id } });
