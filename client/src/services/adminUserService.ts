import api from './api';
import { Employee, EmployeeDirectoryFilters } from '../types/employee.types';
import { Role } from '../types/auth.types';

export const listEmployeesRequest = async (filters: EmployeeDirectoryFilters) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
  );
  const { data } = await api.get<{ employees: Employee[] }>('/admin/users', { params });
  return data.employees;
};

export const updateEmployeeRoleRequest = async (id: string, role: Role) => {
  const { data } = await api.patch<{ employee: Employee }>(`/admin/users/${id}/role`, { role });
  return data.employee;
};

export const updateEmployeeStatusRequest = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  const { data } = await api.patch<{ employee: Employee }>(`/admin/users/${id}/status`, { status });
  return data.employee;
};

export const updateEmployeeDepartmentRequest = async (id: string, departmentId: string | null) => {
  const { data } = await api.patch<{ employee: Employee }>(`/admin/users/${id}/department`, {
    departmentId,
  });
  return data.employee;
};
