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
  // Flips true once AuthHydration has pulled the persisted session back out
  // of localStorage (see the skipHydration comment below). Mirrors the
  // `authHydrated` promise below for components that want to render
  // differently pre/post-hydration rather than just awaiting a fetch.
  hasHydrated: boolean;
  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      clear: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "enginex-auth",
      // Without this, zustand's persist middleware rehydrates from
      // localStorage synchronously as soon as this module loads on the
      // client — which happens before/during the very first (hydration)
      // render, so a returning logged-in user's real session data would
      // already be in the store by then while the server-rendered HTML was
      // built with the default (logged-out) state. Every user?.name /
      // avatar / auth-gated bit of UI driven by this store would then
      // mismatch between server and client HTML. skipHydration defers
      // loading the persisted state until AuthHydration explicitly calls
      // rehydrate() in a useEffect (see components/AuthHydration.tsx),
      // which only runs after the initial client render has already
      // committed and matched the server's output.
      skipHydration: true,
    }
  )
);

// Resolves once AuthHydration's rehydrate() call (see components/AuthHydration.tsx)
// has restored — or confirmed there's nothing to restore — the persisted
// session. Callers that fire a request as soon as they mount (useApiResource)
// await this first so they don't read accessToken before it's actually been
// loaded back from localStorage; without it, the very first authenticated
// fetch on every full page load races the hydration effect and goes out
// with a null token, surfacing as a spurious 401.
let resolveHydrated: () => void;
export const authHydrated = new Promise<void>((resolve) => {
  resolveHydrated = resolve;
});

export function markAuthHydrated() {
  if (!useAuthStore.getState().hasHydrated) {
    useAuthStore.setState({ hasHydrated: true });
  }
  resolveHydrated();
}

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
