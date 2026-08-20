export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserProfile {
  id: number;
  email: string;
  phone: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}