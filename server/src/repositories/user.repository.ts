// All direct Prisma access for User lives here. Services never
// import prisma directly for user data — they go through this repo.
import prisma from '../utils/prisma';
import { Role, UserStatus, Prisma } from '@prisma/client';

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = (id: string) =>
  prisma.user.findUnique({ where: { id } });

export const findUserByResetToken = (resetToken: string) =>
  prisma.user.findFirst({ where: { resetToken } });

export const createUser = (data: { name: string; email: string; passwordHash: string }) =>
  // Signup always creates an Employee — role is hardcoded here, never passed in.
  prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: Role.EMPLOYEE,
    },
  });

export const setResetToken = (userId: string, resetToken: string, resetTokenExpiry: Date) =>
  prisma.user.update({
    where: { id: userId },
    data: { resetToken, resetTokenExpiry },
  });

export const resetPasswordAndClearToken = (userId: string, passwordHash: string) =>
  prisma.user.update({
    where: { id: userId },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

// ------------------------------------------------------------
// Admin-facing queries — Employee Directory & Role Promotion
// (Phase 3 — Admin Module). Everything below still goes through
// this repository, never Prisma directly from services.
// ------------------------------------------------------------

const employeeDirectorySelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  departmentId: true,
  department: { select: { id: true, name: true } },
  createdAt: true,
} as const;

export interface EmployeeDirectoryFilters {
  search?: string;
  role?: Role;
  status?: UserStatus;
  departmentId?: string;
}

export const findAllEmployees = (filters: EmployeeDirectoryFilters) => {
  const where: Prisma.UserWhereInput = {
    ...(filters.role && { role: filters.role }),
    ...(filters.status && { status: filters.status }),
    ...(filters.departmentId && { departmentId: filters.departmentId }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ],
    }),
  };

  return prisma.user.findMany({
    where,
    select: employeeDirectorySelect,
    orderBy: { name: 'asc' },
  });
};

export const findEmployeeById = (id: string) =>
  prisma.user.findUnique({ where: { id }, select: employeeDirectorySelect });

export const updateUserRole = (id: string, role: Role) =>
  prisma.user.update({ where: { id }, data: { role }, select: employeeDirectorySelect });

export const updateUserStatus = (id: string, status: UserStatus) =>
  prisma.user.update({ where: { id }, data: { status }, select: employeeDirectorySelect });

export const updateUserDepartment = (id: string, departmentId: string | null) =>
  prisma.user.update({ where: { id }, data: { departmentId }, select: employeeDirectorySelect });
