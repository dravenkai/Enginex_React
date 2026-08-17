"use client";

import { useEffect } from "react";
import { markAuthHydrated, useAuthStore } from "@/lib/auth/store";

/**
 * Triggers zustand's deferred persist rehydration (see the `skipHydration`
 * comment in lib/auth/store.ts) once mounted on the client. Renders nothing
 * — this only exists for its effect. Mounted once at the root layout so it
 * runs before any page-level component needs the real session state.
 *
 * Being mounted in the root layout doesn't make this run first, though:
 * React fires effects bottom-up (descendants before ancestors) within a
 * commit, so a page deep in the tree that fetches on mount (useApiResource)
 * has its own effect fire before this one. markAuthHydrated() resolves
 * authHydrated once rehydrate() settles, so those callers can await it
 * instead of reading accessToken before it's actually restored.
 */
export default function AuthHydration() {
  useEffect(() => {
    // rehydrate() only returns undefined if there's no storage backend to
    // read from (shouldn't happen in a browser, but fall back to marking
    // hydration done immediately rather than leaving authHydrated pending
    // forever if it ever does).
    const result = useAuthStore.persist.rehydrate();
    if (result) result.then(markAuthHydrated);
    else markAuthHydrated();
  }, []);
  return null;
}
