import { api } from '@/lib/api-client';
import { User } from '@cashbook/utils';
import type { LoginInput, RegistrationInput } from '@cashbook/validation';

export const authApi = {
  login: async (input: LoginInput) => {
    const response = await api.post('/api/auth/login', input);
    return response.data;
  },

  register: async (input: RegistrationInput) => {
    const response = await api.post('/api/auth/register', input);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getProfile: async() : Promise<User> => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },
}; 