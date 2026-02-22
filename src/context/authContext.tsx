import { UserRole } from "@/api";
import { getCurrentUserOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, ReactNode } from "react";

interface User {
  userId: string;
  role: UserRole;
  tokenVersion: number;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data: response,
    isLoading,
    refetch: refetchCurrentUser,
    error,
  } = useQuery({
    ...getCurrentUserOptions(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  const user =
    response?.data && response.success ? (response.data as User) : null;

  const checkAuth = async () => {
    console.log("🔄 checkAuth - refetching user data...");
    await refetchCurrentUser();
  };

  const logout = () => {
    // Clear React Query cache
    refetchCurrentUser();
    sessionStorage.clear();
    localStorage.clear();
  };

  const refetch = async () => {
    console.log("🔄 Refetching user data...");
    await refetchCurrentUser();
  };

  // Log auth state changes
  useEffect(() => {
    console.log("🔍 Auth State Changed:", {
      user,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      error: error ? "Error occurred" : "No error",
    });
  }, [user, isLoading, error]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    isLoading,
    isAdmin,
    isAuthenticated,
    checkAuth,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
