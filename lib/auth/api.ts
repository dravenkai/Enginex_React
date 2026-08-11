export type Role = "CLIENT" | "ENGINEER" | "COMPANY";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
      // Non-JSON response (e.g. an HTML error page from a proxy) — fall through
      // and surface the raw status instead of a parsed message.
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data.message === "string" && data.message) ||
      response.statusText ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export interface AuthUserPayload {
  id?: string;
  name?: string;
  email: string;
  role: Role;
}

export interface LoginResult {
  accessToken: string;
  user: AuthUserPayload;
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<void> {
  await request("/auth/register", { method: "POST", body: JSON.stringify(input) });
}

export async function login(input: { email: string; password: string }): Promise<LoginResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await request<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const payload = data?.data ?? data ?? {};
  const accessToken: string | undefined =
    payload.accessToken ?? payload.token ?? payload.access_token;

  if (!accessToken) {
    throw new ApiError("Unexpected response from the server.", 500);
  }

  const userPayload = payload.user ?? payload.profile ?? {};

  return {
    accessToken,
    user: {
      id: userPayload.id,
      name: userPayload.name,
      email: userPayload.email ?? input.email,
      role: userPayload.role ?? payload.role ?? "CLIENT",
    },
  };
}

export async function verifyEmail(input: { email: string; otp: string }): Promise<void> {
  await request("/auth/verify-email", { method: "POST", body: JSON.stringify(input) });
}

export async function resendOtp(input: { email: string }): Promise<void> {
  await request("/auth/resend-otp", { method: "POST", body: JSON.stringify(input) });
}

export async function logout(): Promise<void> {
  await request("/auth/logout", { method: "POST" });
}
