import { Role } from '../types/auth.types';

// Every nav item / page in the app declares which roles can see it.
// Sidebar and ProtectedRoute both read from this single source of truth.
export const ROLE_LABELS: Record<Role, string> = {
  EMPLOYEE: 'Employee',
  DEPARTMENT_HEAD: 'Department Head',
  ASSET_MANAGER: 'Asset Manager',
  ADMIN: 'Admin',
};

export const ROLE_BADGE_COLORS: Record<Role, string> = {
  EMPLOYEE: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  DEPARTMENT_HEAD: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  ASSET_MANAGER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ADMIN: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300',
};
