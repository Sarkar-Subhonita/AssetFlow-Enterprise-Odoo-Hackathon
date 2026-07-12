import { Request, Response } from 'express';
import { Role, UserStatus } from '@prisma/client';
import { catchAsync } from '../utils/catchAsync';
import * as adminUserService from '../services/admin-user.service';

const VALID_ROLES = Object.values(Role);
const VALID_STATUSES = Object.values(UserStatus);

export const list = catchAsync(async (req: Request, res: Response) => {
  const { search, role, status, departmentId } = req.query;

  const filters = {
    search: typeof search === 'string' && search.trim() ? search.trim() : undefined,
    role: typeof role === 'string' && VALID_ROLES.includes(role as Role) ? (role as Role) : undefined,
    status:
      typeof status === 'string' && VALID_STATUSES.includes(status as UserStatus)
        ? (status as UserStatus)
        : undefined,
    departmentId: typeof departmentId === 'string' && departmentId ? departmentId : undefined,
  };

  const employees = await adminUserService.listEmployees(filters);
  res.status(200).json({ employees });
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const employee = await adminUserService.getEmployee(req.params.id);
  res.status(200).json({ employee });
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
  const employee = await adminUserService.promoteRole(req.params.id, req.body.role, req.user!.id);
  res.status(200).json({ employee });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const employee = await adminUserService.setEmployeeStatus(
    req.params.id,
    req.body.status,
    req.user!.id
  );
  res.status(200).json({ employee });
});

export const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const employee = await adminUserService.assignDepartment(
    req.params.id,
    req.body.departmentId,
    req.user!.id
  );
  res.status(200).json({ employee });
});
