'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, tokenStorage } from './api-client';
import { AuthUser } from '@/types/user';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<{ data: AuthUser }>('/api/v1/auth/me');
      setUser(response.data);
    } catch (error) {
      tokenStorage.clear();
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getAccess();
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await apiClient.post<{data: AuthResponse}>('/api/v1/auth/login', data);
    const response = res.data;
    tokenStorage.set(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const res = await apiClient.post<{data: AuthResponse}>('/api/v1/auth/register', data);
    const response = res.data;
    tokenStorage.set(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
