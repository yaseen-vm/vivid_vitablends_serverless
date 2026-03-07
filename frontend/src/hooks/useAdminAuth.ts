import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginAdmin, logoutAdmin } from "@/services/api/adminApiClient";
import { authStorage } from "@/lib/storage";
import type { LoginCredentials } from "@/types/admin";

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginAdmin(credentials);
      authStorage.setToken(response.data.token);
      authStorage.setAuth("true");

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.user.username}.`,
      });

      navigate("/sys-admin-dashboard");
    } catch {
      const errorMessage = "Login failed";
      setError(errorMessage);

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await logoutAdmin();
      authStorage.clear();

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });

      navigate("/sys-admin-portal");
    } catch {
      authStorage.clear();
      navigate("/sys-admin-portal");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, isLoading, error };
};
