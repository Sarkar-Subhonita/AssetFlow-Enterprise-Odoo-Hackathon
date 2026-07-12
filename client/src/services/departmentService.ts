import api from './api';
import { Department, CreateDepartmentPayload, UpdateDepartmentPayload } from '../types/department.types';

export const listDepartmentsRequest = async () => {
  const { data } = await api.get<{ departments: Department[] }>('/departments');
  return data.departments;
};

export const createDepartmentRequest = async (payload: CreateDepartmentPayload) => {
  const { data } = await api.post<{ department: Department }>('/departments', payload);
  return data.department;
};

export const updateDepartmentRequest = async (id: string, payload: UpdateDepartmentPayload) => {
  const { data } = await api.patch<{ department: Department }>(`/departments/${id}`, payload);
  return data.department;
};

export const deleteDepartmentRequest = async (id: string) => {
  await api.delete(`/departments/${id}`);
};
