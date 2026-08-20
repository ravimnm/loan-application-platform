import client from './client';

export interface UserProfile {
  id: number;
  email: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export const userApi = {
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await client.get<UserProfile>('/api/users/me');
    return response.data;
  },
};