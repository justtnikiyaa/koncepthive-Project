import api from './client';
import type { User } from '../types';

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
};

export const getMeApi = async (): Promise<{ status: string; data: { user: User } }> => {
  const response = await api.get('/auth/me');
  return response.data;
};
