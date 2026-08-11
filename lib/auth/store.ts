import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./api";

export interface AuthUser {
  id?: string;
  name?: string;
  email: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      clear: () => set({ accessToken: null, user: null }),
    }),
    { name: "enginex-auth" }
  )
);

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "ENGINEER":
      return "/engineer/dashboard";
    case "COMPANY":
      return "/team/dashboard";
    case "CLIENT":
    default:
      return "/client/dashboard";
  }
}
