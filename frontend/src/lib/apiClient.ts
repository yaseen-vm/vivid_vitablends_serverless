import { API_BASE_URL } from "./config";

// Compute allowed origin once at module load — fail fast if config is bad
const getAllowedOrigin = (): string => {
  const base = API_BASE_URL;
  if (!base || typeof base !== "string") {
    return window.location.origin;
  }
  try {
    const parsed = new URL(base);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error(`Unsafe API_BASE_URL protocol: ${parsed.protocol}`);
    }
    return parsed.origin;
  } catch {
    throw new Error(`Invalid API_BASE_URL: ${base}`);
  }
};

const ALLOWED_ORIGIN = getAllowedOrigin();

const isValidApiUrl = (url: string): boolean => {
  if (typeof url !== "string" || !url.trim()) return false;

  try {
    const parsed = new URL(url, window.location.origin);

    // 1. Only allow http/https — blocks javascript:, blob:, data:, etc.
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }

    // 2. Strict origin match against compiled-in allowed origin
    if (parsed.origin !== ALLOWED_ORIGIN) {
      return false;
    }

    // 3. Normalize path to block traversal: /api/../other → /other
    const normalized = new URL(parsed.href).pathname;
    if (!normalized.startsWith("/api/")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// Safe fetch wrapper — single choke point for all outbound requests
const safeFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  if (!isValidApiUrl(url)) {
    throw new Error(`Blocked request to disallowed URL: ${url}`);
  }
  // Re-resolve to canonical form to prevent any parser discrepancies
  const canonical = new URL(url, window.location.origin).href;
  return fetch(canonical, options);
};

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

// Hardcode the refresh path rather than interpolating API_BASE_URL again
const REFRESH_URL = `${ALLOWED_ORIGIN}/api/admin/refresh`;

const refreshToken = async (): Promise<string> => {
  const response = await safeFetch(REFRESH_URL, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  const newToken = data?.data?.token;

  if (typeof newToken !== "string" || !newToken) {
    throw new Error("Malformed token in refresh response");
  }

  sessionStorage.setItem("adminToken", newToken);
  return newToken;
};

export const apiClient = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  if (!isValidApiUrl(url)) {
    throw new Error(`Invalid API URL: ${url}`);
  }

  const token = sessionStorage.getItem("adminToken");

  if (!token && url.includes("/api/products") && options.method !== "GET") {
    window.location.href = "/#/sys-admin-portal";
    throw new Error("No authentication token found");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await safeFetch(url, { ...options, headers });

  if (response.status === 401) {
    const data = await response.json();

    if (data.code === "INVALID_TOKEN") {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) =>
              resolve(
                safeFetch(url, {
                  ...options,
                  headers: { ...headers, Authorization: `Bearer ${newToken}` },
                })
              ),
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        return safeFetch(url, {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        });
      } catch (error) {
        processQueue(error as Error, null);
        sessionStorage.removeItem("adminToken");
        if (window.location.hash !== "#/sys-admin-portal") {
          window.location.href = "/#/sys-admin-portal";
        }
        throw error;
      } finally {
        isRefreshing = false;
      }
    }
  }

  return response;
};
