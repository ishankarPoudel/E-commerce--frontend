import { useAuth } from "@/context/authContext";
import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isLoading, isAdmin, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  //  Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  // Admin route but user is not admin - redirect to 403
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/forbidden" />;
  }

  // user is authenticated and has correct role - show content
  return <>{children}</>;
}
