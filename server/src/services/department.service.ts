// Business logic for Departments (Organization Setup). Controllers call
// these functions and stay thin; these functions call the repository,
// never Prisma directly.
import { ApiError } from '../utils/ApiError';
import { logActivity } from '../utils/activityLog.util';
import {
  findAllDepartments,
  findDepartmentById,
  findDepartmentByIdRaw,
  createDepartment as createDepartmentRepo,
  updateDepartment as updateDepartmentRepo,
  deleteDepartment as deleteDepartmentRepo,
  getDepartmentDependencyCounts,
} from '../repositories/department.repository';
import { findUserById } from '../repositories/user.repository';
import { CreateDepartmentInput, UpdateDepartmentInput } from '../validators/department.validator';

// Walks up the parent chain from `candidateParentId` to make sure `departmentId`
// never appears — i.e. assigning this parent would not create a cycle.
const assertNoCycle = async (departmentId: string, candidateParentId: string) => {
  if (candidateParentId === departmentId) {
    throw new ApiError(400, 'A department cannot be its own parent');
  }

  let cursor: string | null = candidateParentId;
  const seen = new Set<string>();

  while (cursor) {
    if (cursor === departmentId) {
      throw new ApiError(400, 'That would create a circular department hierarchy');
    }
    if (seen.has(cursor)) break; // safety net against any pre-existing bad data
    seen.add(cursor);

    const dept = await findDepartmentByIdRaw(cursor);
    cursor = dept?.parentDepartmentId ?? null;
  }
};

const assertHeadIsValid = async (headUserId: string) => {
  const user = await findUserById(headUserId);
  if (!user) {
    throw new ApiError(404, 'Selected department head does not exist');
  }
  if (user.status !== 'ACTIVE') {
    throw new ApiError(400, 'Selected department head is not an active user');
  }
};

export const listDepartments = () => findAllDepartments();

export const getDepartment = async (id: string) => {
  const department = await findDepartmentById(id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

export const createDepartment = async (input: CreateDepartmentInput, actorUserId: string) => {
  if (input.headUserId) {
    await assertHeadIsValid(input.headUserId);
  }
  if (input.parentDepartmentId) {
    const parent = await findDepartmentByIdRaw(input.parentDepartmentId);
    if (!parent) {
      throw new ApiError(404, 'Selected parent department does not exist');
    }
  }

  const department = await createDepartmentRepo({
    name: input.name,
    headUserId: input.headUserId ?? null,
    parentDepartmentId: input.parentDepartmentId ?? null,
  });

  await logActivity({
    userId: actorUserId,
    action: 'DEPARTMENT_CREATE',
    entityType: 'Department',
    entityId: department.id,
    metadata: { name: department.name },
  });

  return department;
};

export const updateDepartment = async (
  id: string,
  input: UpdateDepartmentInput,
  actorUserId: string
) => {
  const existing = await findDepartmentByIdRaw(id);
  if (!existing) {
    throw new ApiError(404, 'Department not found');
  }

  if (input.headUserId) {
    await assertHeadIsValid(input.headUserId);
  }

  if (input.parentDepartmentId) {
    const parent = await findDepartmentByIdRaw(input.parentDepartmentId);
    if (!parent) {
      throw new ApiError(404, 'Selected parent department does not exist');
    }
    await assertNoCycle(id, input.parentDepartmentId);
  }

  const department = await updateDepartmentRepo(id, input);

  await logActivity({
    userId: actorUserId,
    action: 'DEPARTMENT_UPDATE',
    entityType: 'Department',
    entityId: id,
    metadata: input,
  });

  return department;
};

export const deleteDepartment = async (id: string, actorUserId: string) => {
  const existing = await findDepartmentByIdRaw(id);
  if (!existing) {
    throw new ApiError(404, 'Department not found');
  }

  const deps = await getDepartmentDependencyCounts(id);
  const inUse = Object.values(deps).some((count) => count > 0);

  if (inUse) {
    throw new ApiError(
      409,
      'This department is in use (members, sub-departments, assets, or history reference it) — deactivate it instead of deleting'
    );
  }

  await deleteDepartmentRepo(id);

  await logActivity({
    userId: actorUserId,
    action: 'DEPARTMENT_DELETE',
    entityType: 'Department',
    entityId: id,
    metadata: { name: existing.name },
  });
};
