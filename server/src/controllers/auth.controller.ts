import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/auth.service';

export const signup = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.signup(req.body);
  req.session.userId = user.id;
  res.status(201).json({ user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.login(req.body);
  req.session.userId = user.id;
  res.status(200).json({ user });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, try again' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.session.userId as string);
  res.status(200).json({ user });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const { resetToken } = await authService.forgotPassword(email);

  // Dev-only convenience: Phase 1 has no email service, so the token
  // comes back in the response. Replace with "check your email" once
  // an email provider is wired up.
  res.status(200).json({
    message: 'If that email exists, a reset link has been generated',
    devResetToken: resetToken,
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.status(200).json({ message: 'Password has been reset — you can log in now' });
});
