// protect: confirms a valid session exists and attaches req.user.
// authorize: gates a route to specific roles (used once real features exist).
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import prisma from '../utils/prisma';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';

export const protect = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.session.userId;

  if (!userId) {
    throw new ApiError(401, 'You must be logged in to do that');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.status !== 'ACTIVE') {
    throw new ApiError(401, 'Your session is no longer valid');
  }

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
});

export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'You must be logged in to do that');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You don't have permission to do that");
    }
    next();
  };
