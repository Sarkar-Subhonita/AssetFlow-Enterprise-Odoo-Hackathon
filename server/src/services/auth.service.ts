// Business logic for authentication. Controllers call these functions
// and stay thin; these functions call the repository, never Prisma directly.
import crypto from 'crypto';
import { ApiError } from '../utils/ApiError';
import { hashPassword, comparePassword } from '../utils/password.util';
import {
  findUserByEmail,
  findUserById,
  findUserByResetToken,
  createUser,
  setResetToken,
  resetPasswordAndClearToken,
} from '../repositories/user.repository';
import { SignupInput, LoginInput } from '../validators/auth.validator';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const toPublicUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const signup = async (input: SignupInput) => {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new ApiError(409, 'An account with that email already exists');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({ name: input.name, email: input.email, passwordHash });

  return toPublicUser(user);
};

export const login = async (input: LoginInput) => {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'ACTIVE') {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return toPublicUser(user);
};

export const getCurrentUser = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(401, 'Your session is no longer valid');
  }
  return toPublicUser(user);
};

export const forgotPassword = async (email: string) => {
  const user = await findUserByEmail(email);

  // Always behave the same way whether or not the account exists,
  // so a caller can't use this endpoint to discover valid emails.
  if (!user) {
    return { resetToken: null };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await setResetToken(user.id, resetToken, resetTokenExpiry);

  // Phase 1 has no email service wired up yet, so the token is returned
  // directly. A later phase should email this link instead of returning it.
  return { resetToken };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await findUserByResetToken(token);

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new ApiError(400, 'That reset link is invalid or has expired');
  }

  const passwordHash = await hashPassword(newPassword);
  await resetPasswordAndClearToken(user.id, passwordHash);
};
