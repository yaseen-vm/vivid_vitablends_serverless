import { Navigate } from "react-router-dom";
import { authStorage } from "@/lib/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authStorage.getAuth() === "true";

  if (!isAuthenticated) {
    return <Navigate to="/sys-admin-portal" replace />;
  }

  return <>{children}</>;
};
