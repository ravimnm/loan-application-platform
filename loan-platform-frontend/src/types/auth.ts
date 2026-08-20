export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyPhoneRequest {
  email: string;
  otp: string;
}

export interface RegistrationResponse {
  userId: number;
  email: string;
  phone: string;
  message: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: UserRole;
}

export interface User {
  id?: number;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string,phone: string,password: string) => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
  resendEmailOtp: () => Promise<void>;
  verifyPhone: (otp: string) => Promise<void>;
  logout: () => void;
  resendPhoneOtp: () => Promise<void>;
  setUser: (user: User) => void;
}
