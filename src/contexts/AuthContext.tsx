"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { signupUser } from "@/api/user";
import type { SignupFormValues } from "@/components/auth/SignupForm";
import type { AppUser } from "@/types/user";

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
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      setInitializing(true);
      try {
        const accessToken = localStorage.getItem("insightica_access_token");
        const storedUser = localStorage.getItem("insightica_user");

        if (accessToken && storedUser) {
          const user: AppUser = JSON.parse(storedUser);
          setCurrentUser(user);
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Failed to initialize auth from localStorage:", error);
        // Clear potentially corrupted data
        setCurrentUser(null);
        localStorage.removeItem("insightica_access_token");
        localStorage.removeItem("insightica_refresh_token");
        localStorage.removeItem("insightica_user");
        delete apiClient.defaults.headers.common["Authorization"];
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/user/signin/", {
        email: email,
        password: pass,
      });
      const { access, refresh, user } = response.data;

      localStorage.setItem("insightica_access_token", access);
      localStorage.setItem("insightica_refresh_token", refresh);
      localStorage.setItem("insightica_user", JSON.stringify(user));

      apiClient.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      setCurrentUser(user);

      router.push("/tools");
    } finally {
      setLoading(false);
    }
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
      await apiClient.post("/user/signout/", {});
    } catch (error) {
      console.error(
        "Logout API call failed, but proceeding with client-side logout:",
        error,
      );
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("insightica_access_token");
      localStorage.removeItem("insightica_refresh_token");
      localStorage.removeItem("insightica_user");
      delete apiClient.defaults.headers.common["Authorization"];
      setLoading(false);
      router.push("/");
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
  };

  // Render children only when not initializing to prevent layout shifts or flashes
  return (
    <AuthContext.Provider value={value}>
      {initializing ? null : children}
    </AuthContext.Provider>
  );
};
