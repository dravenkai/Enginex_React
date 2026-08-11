"use client";

import { ApiError } from "@/lib/auth/api";
import { useAuthStore } from "@/lib/auth/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function rawRequest(path: string, options: RequestInit = {}): Promise<any> {
  let response: Response;
  try {
    response = await fetch(`/api/backend${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }

  const text = await response.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response (proxy/edge error page) — fall through, data stays null.
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data.message === "string" && data.message) ||
      response.statusText ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return data;
}

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = rawRequest("/auth/refresh", { method: "POST" })
      .then((data) => {
        const token: string | undefined = data?.data?.accessToken ?? data?.accessToken;
        const current = useAuthStore.getState();
        if (token && current.user) {
          current.setSession({ accessToken: token, user: current.user });
          return token;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Authenticated request against the backend, proxied through /api/backend.
 * Attaches the stored access token, retries once via /auth/refresh on a 401,
 * and unwraps the `{ success, data }` response envelope.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  _retried = false
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const data = await rawRequest(path, { ...options, headers });
    if (data && typeof data === "object" && "success" in data) {
      return (data.data ?? data) as T;
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && !_retried) {
      const newToken = await refreshAccessToken();
      if (newToken) return apiRequest<T>(path, options, true);
    }
    throw error;
  }
}

export { ApiError };
