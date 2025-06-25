
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { signupUser, getMe } from '@/api/user';
import type { SignupFormValues } from '@/components/auth/SignupForm';
import type { AppUser } from '@/types/user';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (userData: SignupFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('insightica_access_token');
      if (accessToken) {
        try {
          // The interceptor will handle token refresh if needed
          const user = await getMe();
          setCurrentUser(user);
        } catch (error) {
          console.error("Failed to authenticate with stored token:", error);
          // Cleanup if getMe fails even after potential refresh attempt
          setCurrentUser(null);
          localStorage.removeItem('insightica_access_token');
          localStorage.removeItem('insightica_refresh_token');
          delete apiClient.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // The backend endpoint for token expects a 'username' field.
    // We are passing the email as the username.
    const response = await apiClient.post('/user/signin/', { email: email, password: pass });
    const { access, refresh, user } = response.data;
    
    localStorage.setItem('insightica_access_token', access);
    localStorage.setItem('insightica_refresh_token', refresh);
    
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    // const user = await getMe();
    setCurrentUser(user);
    
    setLoading(false);
    router.push('/');
  };

  const signup = async (userData: SignupFormValues) => {
    setLoading(true);
    try {
      await signupUser(userData);
    } catch (error: any) {
      console.error("Signup failed in AuthContext:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
        await apiClient.post('/user/signout/', {});
    } catch (error) {
        console.error("Logout API call failed, but proceeding with client-side logout:", error);
    } finally {
        setCurrentUser(null);
        localStorage.removeItem('insightica_access_token');
        localStorage.removeItem('insightica_refresh_token');
        delete apiClient.defaults.headers.common['Authorization'];
        setLoading(false);
        router.push('/');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
