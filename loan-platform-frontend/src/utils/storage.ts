import type { User } from '../types/auth';

const TOKEN_KEY = 'ezfinanz_token';
const USER_KEY = 'ezfinanz_user';

export const storage = {
  // Token methods
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // User methods
  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  setApplicationId: (id: number): void => {
    localStorage.setItem('ezfinanz_application_id', id.toString());
  },

  removeApplicationId: (): void => {
    localStorage.removeItem('ezfinanz_application_id');
  },

  // Clear all
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('ezfinanz_application_id');
  },
};
