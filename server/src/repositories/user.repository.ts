// All direct Prisma access for User lives here. Services never
// import prisma directly for user data — they go through this repo.
import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

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
