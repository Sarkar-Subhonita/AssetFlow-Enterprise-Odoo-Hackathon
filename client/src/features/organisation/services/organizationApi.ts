// src/features/organization/services/organizationApi.ts

import axios from "axios";
import {
  Department,
  AssetCategory,
  Employee,
  DepartmentPayload,
  CategoryPayload,
  EmployeeUpdatePayload,
} from "../types/organization";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/////////////////////////////
// Departments
/////////////////////////////

export const getDepartments = async (): Promise<Department[]> => {
  const { data } = await api.get("/departments");
  return data;
};

export const createDepartment = async (
  payload: DepartmentPayload
): Promise<Department> => {
  const { data } = await api.post("/departments", payload);
  return data;
};

export const updateDepartment = async (
  id: string,
  payload: DepartmentPayload
): Promise<Department> => {
  const { data } = await api.put(`/departments/${id}`, payload);
  return data;
};

export const changeDepartmentStatus = async (
  id: string,
  status: string
) => {
  const { data } = await api.patch(`/departments/${id}/status`, {
    status,
  });

  return data;
};

/////////////////////////////
// Categories
/////////////////////////////

export const getCategories = async (): Promise<AssetCategory[]> => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (
  payload: CategoryPayload
): Promise<AssetCategory> => {
  const { data } = await api.post("/categories", payload);
  return data;
};

export const updateCategory = async (
  id: string,
  payload: CategoryPayload
): Promise<AssetCategory> => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
};

export const changeCategoryStatus = async (
  id: string,
  status: string
) => {
  const { data } = await api.patch(`/categories/${id}/status`, {
    status,
  });

  return data;
};

/////////////////////////////
// Employees
/////////////////////////////

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get("/employees");
  return data;
};

export const updateEmployee = async (
  id: string,
  payload: EmployeeUpdatePayload
): Promise<Employee> => {
  const { data } = await api.put(`/employees/${id}`, payload);
  return data;
};

export const updateEmployeeRole = async (
  id: string,
  role: string
) => {
  const { data } = await api.patch(`/employees/${id}/role`, {
    role,
  });

  return data;
};

export const updateEmployeeStatus = async (
  id: string,
  status: string
) => {
  const { data } = await api.patch(`/employees/${id}/status`, {
    status,
  });

  return data;
};