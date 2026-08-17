"use client";

import { ApiError } from "@/lib/auth/api";
import { authHydrated, useAuthStore } from "@/lib/auth/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function rawRequest(path: string, options: RequestInit = {}): Promise<any> {
  let response: Response;
  // FormData bodies (multipart image uploads) need the browser to set its
  // own Content-Type with the multipart boundary — forcing
  // application/json here (the default for every other call) breaks the
  // backend's multipart parser.
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  try {
    response = await fetch(`/api/backend${path}`, {
      ...options,
      cache: "no-store",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

// There's no route-level auth guard (no middleware.ts) — pages render
// regardless of session state, and every authenticated call just fails with
// a 401 if there isn't a valid one. That's fine for a single failed request,
// but if the session is truly dead (refresh also failed) the user is left
// stranded on a page that will never load, silently hammering the backend
// with doomed requests on every poll/re-render. Once that's confirmed, force
// them back to login instead.
function handleSessionExpired() {
  useAuthStore.getState().clear();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

async function performRequest<T>(path: string, options: RequestInit, _retried: boolean): Promise<T> {
  // Every page fetches its data as soon as it mounts (useApiResource), but
  // AuthHydration (which restores accessToken from localStorage) lives in
  // the root layout — an ancestor whose own mount effect fires *after* a
  // descendant page's effect in the same commit (React runs effects
  // bottom-up). Without this, the very first authenticated call on every
  // full page load reads accessToken before it's been restored and goes out
  // unauthenticated, surfacing as a spurious 401. Resolves immediately on
  // every call after the first.
  await authHydrated;
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const data = await rawRequest(path, { ...options, headers });
    // Most endpoints wrap the payload as { success, data }, but some (the /clients/*
    // routes) skip "success" and only wrap as { data }. Unwrap either shape.
    if (data && typeof data === "object" && ("success" in data || "data" in data)) {
      return (data.data ?? data) as T;
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      if (!_retried) {
        const newToken = await refreshAccessToken();
        if (newToken) return performRequest<T>(path, options, true);
      }
      // Either this was already a retry (fresh token still got a 401), or
      // the refresh itself failed — either way the session is dead.
      handleSessionExpired();
    }
    throw error;
  }
}

// Coalesces truly-concurrent duplicate GETs into a single network request.
// A layout's header and the page it wraps commonly fetch the same resource
// (e.g. the engineer's own profile) independently on mount, which normally
// means two separate requests hit the backend at once — doubling the
// visible failures/noise whenever the backend is flaky, and just wasteful
// otherwise. This isn't a data cache (entries are removed as soon as the
// request settles), only a dedupe for requests that are genuinely in
// flight at the same time.
const inFlightGetRequests = new Map<string, Promise<unknown>>();

/**
 * Authenticated request against the backend, proxied through /api/backend.
 * Attaches the stored access token, retries once via /auth/refresh on a 401,
 * and unwraps the `{ success, data }` response envelope.
 */
export function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  if (method !== "GET") return performRequest<T>(path, options, false);

  const existing = inFlightGetRequests.get(path);
  if (existing) return existing as Promise<T>;

  const promise = performRequest<T>(path, options, false).finally(() => {
    if (inFlightGetRequests.get(path) === promise) inFlightGetRequests.delete(path);
  });
  inFlightGetRequests.set(path, promise);
  return promise;
}

/**
 * Pulls a plain array out of a list-endpoint response, regardless of exactly
 * how it's nested (a bare array, or an object with the array under a common
 * key like `data`/`items`/`results`/etc.). apiRequest() already unwraps one
 * `{ success, data }` envelope layer; this handles the backend nesting the
 * array one level deeper than that instead of returning it directly, so a
 * list page never crashes on `.map`/`.filter` because of a shape mismatch.
 */
export function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    for (const key of [
      "data",
      "items",
      "results",
      "list",
      "engineers",
      "favorites",
      "projects",
      "members",
      "companies",
      "invitations",
    ]) {
      const inner = (value as Record<string, unknown>)[key];
      if (Array.isArray(inner)) return inner as T[];
    }
  }
  return [];
}

/**
 * Turns a caught error into text safe to show a user. Backend validation/
 * business messages (4xx — "Invalid credentials", "Email already exists",
 * "You've already applied to this project") are real, meant-for-users
 * feedback and pass through as-is, as do plain client-side Errors we throw
 * ourselves (e.g. "Please choose a JPEG, PNG, WEBP, or GIF image.") — those
 * aren't backend text either. Backend server errors (5xx) are replaced with
 * a generic message instead of surfacing raw/technical error text (stack
 * traces, "Internal Server Error", etc.) to the user. Network failures
 * already carry a friendly message of our own from rawRequest(), not
 * backend text, so those pass through too.
 */
export function friendlyErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof ApiError) {
    if (error.status === 0 || (error.status >= 400 && error.status < 500)) {
      return error.message;
    }
    return fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export { ApiError };
