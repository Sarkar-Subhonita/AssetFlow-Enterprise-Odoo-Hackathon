// src/features/organization/types/organization.ts

export type UserRole =
  | "ADMIN"
  | "ASSET_MANAGER"
  | "DEPARTMENT_HEAD"
  | "EMPLOYEE";

export type Status = "ACTIVE" | "INACTIVE";

export interface Department {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  headName?: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
  warrantyPeriod?: number;
  maintenanceInterval?: number;
  icon?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId?: string;
  departmentName?: string;
  role: UserRole;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
  headId?: string;
  parentDepartmentId?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  warrantyPeriod?: number;
  maintenanceInterval?: number;
  icon?: string;
}

export interface EmployeeUpdatePayload {
  departmentId?: string;
  role?: UserRole;
  status?: Status;
}