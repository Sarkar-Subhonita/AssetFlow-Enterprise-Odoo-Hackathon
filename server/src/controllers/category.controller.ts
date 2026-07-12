import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as categoryService from '../services/category.service';

export const list = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.listCategories();
  res.status(200).json({ categories });
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategory(req.params.id);
  res.status(200).json({ category });
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body, req.user!.id);
  res.status(201).json({ category });
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.user!.id);
  res.status(200).json({ category });
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id, req.user!.id);
  res.status(200).json({ message: 'Category deleted' });
});
