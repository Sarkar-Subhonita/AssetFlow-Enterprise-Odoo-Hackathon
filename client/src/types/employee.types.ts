import { Role } from './auth.types';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  departmentId: string | null;
  department: { id: string; name: string } | null;
  createdAt: string;
}

export interface EmployeeDirectoryFilters {
  search?: string;
  role?: Role;
  status?: 'ACTIVE' | 'INACTIVE';
  departmentId?: string;
}
