"use client";

import { useCallback, useEffect, useState } from "react";

function loadIds(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveIds(key: string, ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch {
    // Best effort — dismissed state just won't persist across reloads.
  }
}

/**
 * Tracks a set of "dismissed" ids in localStorage, scoped to `key`. Lets a
 * user hide individual list items (a no-longer-actionable application, a
 * closed-out assignment, ...) from a view — there's no backend delete
 * endpoint for these, so nothing is removed server-side, just hidden
 * locally. `restoreAll` makes that reversible instead of a silent, one-way
 * disappearance.
 */
export function useDismissedIds(key: string) {
  // Starts empty (matching the server-rendered HTML, which has no access to
  // localStorage) and only loads the real stored set after mount — reading
  // it eagerly in the useState initializer runs during hydration too and
  // would render different content than the server did, which is a
  // hydration mismatch, not just a client vs. server *fetch* difference.
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setIds(loadIds(key));
  }, [key]);

  const dismiss = useCallback(
    (id: string | number) => {
      setIds((current) => {
        const next = new Set(current);
        next.add(String(id));
        saveIds(key, next);
        return next;
      });
    },
    [key]
  );

  const restoreAll = useCallback(() => {
    setIds(new Set());
    saveIds(key, new Set());
  }, [key]);

  const isDismissed = useCallback((id: string | number) => ids.has(String(id)), [ids]);

  return { isDismissed, dismiss, restoreAll, dismissedCount: ids.size };
}
