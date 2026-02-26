import { API_BASE_URL } from "./config";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  const newToken = data.data.token;
  sessionStorage.setItem("adminToken", newToken);
  return newToken;
};

export const apiClient = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = sessionStorage.getItem("adminToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const data = await response.json();
    
    if (data.code === "INVALID_TOKEN") {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              resolve(
                fetch(url, {
                  ...options,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${token}`,
                  },
                })
              );
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        isRefreshing = false;

        return fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (error) {
        processQueue(error as Error, null);
        isRefreshing = false;
        sessionStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        throw error;
      }
    }
  }

  return response;
};
