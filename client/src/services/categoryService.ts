import api from './api';
import { AssetCategory, CreateCategoryPayload, UpdateCategoryPayload } from '../types/category.types';

export const listCategoriesRequest = async () => {
  const { data } = await api.get<{ categories: AssetCategory[] }>('/categories');
  return data.categories;
};

export const createCategoryRequest = async (payload: CreateCategoryPayload) => {
  const { data } = await api.post<{ category: AssetCategory }>('/categories', payload);
  return data.category;
};

export const updateCategoryRequest = async (id: string, payload: UpdateCategoryPayload) => {
  const { data } = await api.patch<{ category: AssetCategory }>(`/categories/${id}`, payload);
  return data.category;
};

export const deleteCategoryRequest = async (id: string) => {
  await api.delete(`/categories/${id}`);
};
