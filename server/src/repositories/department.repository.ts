// All direct Prisma access for Department lives here. Services never
// import prisma directly for department data — they go through this repo.
import prisma from '../utils/prisma';
import { DepartmentStatus } from '@prisma/client';

const departmentListSelect = {
  id: true,
  name: true,
  status: true,
  headUserId: true,
  head: { select: { id: true, name: true, email: true } },
  parentDepartmentId: true,
  parent: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
  _count: { select: { members: true, children: true, currentAssets: true } },
} as const;

export const findAllDepartments = () =>
  prisma.department.findMany({
    select: departmentListSelect,
    orderBy: { name: 'asc' },
  });

export const findDepartmentById = (id: string) =>
  prisma.department.findUnique({
    where: { id },
    select: departmentListSelect,
  });

export const findDepartmentByIdRaw = (id: string) =>
  prisma.department.findUnique({ where: { id } });

export const createDepartment = (data: {
  name: string;
  headUserId?: string | null;
  parentDepartmentId?: string | null;
}) =>
  prisma.department.create({
    data,
    select: departmentListSelect,
  });

export const updateDepartment = (
  id: string,
  data: {
    name?: string;
    headUserId?: string | null;
    parentDepartmentId?: string | null;
    status?: DepartmentStatus;
  }
) =>
  prisma.department.update({
    where: { id },
    data,
    select: departmentListSelect,
  });

export const deleteDepartment = (id: string) => prisma.department.delete({ where: { id } });

// Dependency counts used to guard deletion — a department that is in use
// anywhere in the org graph should be deactivated, not deleted.
export const getDepartmentDependencyCounts = async (id: string) => {
  const [members, children, assets, allocations, bookings, auditCycles] = await Promise.all([
    prisma.user.count({ where: { departmentId: id } }),
    prisma.department.count({ where: { parentDepartmentId: id } }),
    prisma.asset.count({ where: { currentHolderDepartmentId: id } }),
    prisma.allocation.count({ where: { departmentId: id } }),
    prisma.booking.count({ where: { departmentId: id } }),
    prisma.auditCycle.count({ where: { scopeDepartmentId: id } }),
  ]);
  return { members, children, assets, allocations, bookings, auditCycles };
};
