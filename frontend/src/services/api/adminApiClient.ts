import { API_BASE_URL } from "@/lib/config";
import type { LoginCredentials, LoginResponse } from "@/types/admin";

export const refreshToken = async (): Promise<{
  token: string;
  expiresIn: string;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Token refresh failed");
  }

  return data.data;
};

export const loginAdmin = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const logoutAdmin = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Logout failed");
  }
};
