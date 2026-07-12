import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as departmentService from '../services/department.service';

export const list = catchAsync(async (_req: Request, res: Response) => {
  const departments = await departmentService.listDepartments();
  res.status(200).json({ departments });
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const department = await departmentService.getDepartment(req.params.id);
  res.status(200).json({ department });
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const department = await departmentService.createDepartment(req.body, req.user!.id);
  res.status(201).json({ department });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body, req.user!.id);
  res.status(200).json({ department });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await departmentService.deleteDepartment(req.params.id, req.user!.id);
  res.status(200).json({ message: 'Department deleted' });
});
