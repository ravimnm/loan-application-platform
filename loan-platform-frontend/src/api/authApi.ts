import client from './client';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  VerifyPhoneRequest,
  AuthResponse,
  RegistrationResponse
} from '../types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegistrationResponse> => {
    const response = await client.post<RegistrationResponse>(
      '/api/auth/register',
      data
    );

    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<void> => {
    const response = await client.post<string>('/api/auth/verify-email', data);
    return response.data;
  },

  resendEmailOtp: async (email: string): Promise<string> => {
    const response = await client.post<string>(
      '/api/auth/resend-email-otp',
      { email }
    );

    return response.data;
  },

  resendPhoneOtp: async (email: string): Promise<string> => {
    const response = await client.post<string>(
      '/api/auth/resend-phone-otp',
      { email }
    );

    return response.data;
  },

  verifyPhone: async (data: VerifyPhoneRequest): Promise<string> => {
    const response = await client.post<string>('/api/auth/verify-phone', data);
    return response.data;
  },

  me: async (): Promise<AuthResponse> => {

    const response =
      await client.get<AuthResponse>(
        '/api/auth/me'
      );

    return response.data;
  },
};
