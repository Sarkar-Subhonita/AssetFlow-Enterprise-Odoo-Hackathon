// Business logic for the Employee Directory and Role Promotion
// (Phase 3 — Admin Module). Controllers call these functions and stay
// thin; these functions call the repository, never Prisma directly.
import { Role, UserStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { logActivity } from '../utils/activityLog.util';
import {
  findAllEmployees,
  findEmployeeById,
  updateUserRole,
  updateUserStatus,
  updateUserDepartment,
  EmployeeDirectoryFilters,
} from '../repositories/user.repository';
import { findDepartmentByIdRaw } from '../repositories/department.repository';

export const listEmployees = (filters: EmployeeDirectoryFilters) => findAllEmployees(filters);

export const getEmployee = async (id: string) => {
  const employee = await findEmployeeById(id);
  if (!employee) {
    throw new ApiError(404, 'Employee not found');
  }
  return employee;
};

export const promoteRole = async (targetUserId: string, role: Role, actorUserId: string) => {
  if (targetUserId === actorUserId) {
    throw new ApiError(400, "You can't change your own role");
  }

  const target = await findEmployeeById(targetUserId);
  if (!target) {
    throw new ApiError(404, 'Employee not found');
  }

  const previousRole = target.role;
  const updated = await updateUserRole(targetUserId, role);

  await logActivity({
    userId: actorUserId,
    action: 'USER_ROLE_CHANGE',
    entityType: 'User',
    entityId: targetUserId,
    metadata: { from: previousRole, to: role },
  });

  return updated;
};

export const setEmployeeStatus = async (
  targetUserId: string,
  status: UserStatus,
  actorUserId: string
) => {
  if (targetUserId === actorUserId) {
    throw new ApiError(400, "You can't change your own account status");
  }

  const target = await findEmployeeById(targetUserId);
  if (!target) {
    throw new ApiError(404, 'Employee not found');
  }

  const updated = await updateUserStatus(targetUserId, status);

  await logActivity({
    userId: actorUserId,
    action: 'USER_STATUS_CHANGE',
    entityType: 'User',
    entityId: targetUserId,
    metadata: { from: target.status, to: status },
  });

  return updated;
};

export const assignDepartment = async (
  targetUserId: string,
  departmentId: string | null,
  actorUserId: string
) => {
  const target = await findEmployeeById(targetUserId);
  if (!target) {
    throw new ApiError(404, 'Employee not found');
  }

  if (departmentId) {
    const department = await findDepartmentByIdRaw(departmentId);
    if (!department) {
      throw new ApiError(404, 'Selected department does not exist');
    }
  }

  const updated = await updateUserDepartment(targetUserId, departmentId);

  await logActivity({
    userId: actorUserId,
    action: 'USER_DEPARTMENT_ASSIGN',
    entityType: 'User',
    entityId: targetUserId,
    metadata: { from: target.departmentId, to: departmentId },
  });

  return updated;
};
