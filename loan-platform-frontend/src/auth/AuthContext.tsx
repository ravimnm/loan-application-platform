import React, { useState, useCallback, useEffect } from 'react';
import type { AuthContextType, User } from '../types/auth';
import { authApi } from '../api/authApi';
import { storage } from '../utils/storage';
import { AuthContext } from './AuthContextValue';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    storage.clear();
    setToken(null);
    setUser(null);
  }, []);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<User> => {
    try {
      setIsLoading(true);

      const response = await authApi.login({
        email,
        password,
      });

      storage.setToken(response.token);
      setToken(response.token);

      const userData: User = {
        id: response.userId,
        email: response.email,
        role: response.role,
      };

      storage.setUser(userData);
      setUser(userData);

      return userData;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const register = useCallback(
    async (email: string, phone: string, password: string) => {
      try {
        setIsLoading(true);

        const response = await authApi.register({
          email,
          phone,
          password,
        });

        /*
        * Registration does not authenticate the user.
        * Backend only creates the account and sends the email OTP.
        *
        * Therefore:
        * - Do NOT store a JWT
        * - Do NOT mark the user as authenticated
        * - Store only the basic user information needed
        *   by the verification pages.
        */

        const userData: User = {
          id: response.userId,
          email: response.email,
          phone: response.phone,
          role: 'CUSTOMER',
        };

        storage.setUser(userData);
        setUser(userData);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyEmail = useCallback(
    async (otp: string) : Promise<void> => {
      try {
        setIsLoading(true);
  
        if (!user?.email) {
          throw new Error('Email is required for verification');
        }
  
        console.log('EMAIL VERIFY:', {
          email: user.email,
          otp
        });
  
        const response = await authApi.verifyEmail({
          email: user.email,
          otp,
        });
  
        console.log('EMAIL VERIFY SUCCESS:', response);
  
        return response;
  
      } catch (error) {
        console.error('EMAIL VERIFY FAILED:', error);
        throw error;
  
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );
  const resendEmailOtp = useCallback(async () => {
    if (!user?.email) {
      throw new Error('Email is required to resend verification OTP');
    }

    try {
      setIsLoading(true);

      await authApi.resendEmailOtp(user.email);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);


  const verifyPhone = useCallback(async (otp: string) => {
    try {
      setIsLoading(true);

      if (!user?.email) {
        throw new Error('Email is required for phone verification');
      }

      await authApi.verifyPhone({
        email: user.email,
        otp,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const resendPhoneOtp = useCallback(async () => {
    if (!user?.email) {
      throw new Error(
        'Email is required to resend phone verification OTP'
      );
    }

    try {
      setIsLoading(true);

      await authApi.resendPhoneOtp(user.email);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  const handleSetUser = useCallback((newUser: User) => {
    storage.setUser(newUser);
    setUser(newUser);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    verifyEmail,
    resendEmailOtp,
    verifyPhone,
    resendPhoneOtp,
    logout,
    setUser: handleSetUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
