import api from './api';
import { User } from '../types/auth.types';

export const signupRequest = async (name: string, email: string, password: string) => {
  const { data } = await api.post<{ user: User }>('/auth/signup', { name, email, password });
  return data.user;
};

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post<{ user: User }>('/auth/login', { email, password });
  return data.user;
};

export const logoutRequest = async () => {
  await api.post('/auth/logout');
};

export const meRequest = async () => {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
};

export const forgotPasswordRequest = async (email: string) => {
  const { data } = await api.post<{ message: string; devResetToken: string | null }>(
    '/auth/forgot-password',
    { email }
  );
  return data;
};

export const resetPasswordRequest = async (token: string, password: string) => {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', {
    token,
    password,
  });
  return data;
};
