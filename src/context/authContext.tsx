import { UserRole } from "@/api";
import { getCurrentUserOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasToken = document.cookie.includes("accessToken");

  //get current user details
  const {
    data: response,
    isLoading: queryLoading,
    refetch: refetchCurrentUser,
  } = useQuery({
    ...getCurrentUserOptions(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: hasToken, // Only fetch if token exists
  });

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      if (response?.data && response.success) {
        setUser(response.data as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  const refetch = async () => {
    const result = await refetchCurrentUser();

    if (result.data?.data && result.data.success) {
      setUser(result.data.data as User);
      return;
    }

    setUser(null);
  };
  useEffect(() => {
    if (response) {
      checkAuth();
    }
  }, [response]);

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  const value = {
    user,
    isLoading,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
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
