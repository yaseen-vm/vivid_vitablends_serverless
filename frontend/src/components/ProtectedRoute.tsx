import { Navigate } from "react-router-dom";
import { authStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { refreshToken } from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    authStorage.getAuth() === "true" ? true : null
  );

  useEffect(() => {
    if (authStorage.getAuth() === "true") {
      setIsAuthenticated(true);
      return;
    }

    const verify = async () => {
      try {
        await refreshToken();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    verify();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sys-admin-portal" replace />;
  }

  return <>{children}</>;
};
