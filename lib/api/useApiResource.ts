"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ApiResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface ApiResourceOptions {
  /**
   * Re-fetch automatically on this interval (ms) while the tab is visible,
   * so data stays current without a manual page reload. Backend requests can
   * be slow/inconsistent (observed 1–15s for the same call), so keep this
   * loose — a few seconds is too aggressive and will pile up overlapping
   * requests against a backend that's already slow. Omit for one-shot
   * fetch-on-mount behavior (the default).
   */
  pollMs?: number;
}

/**
 * Fetches a backend resource on mount and exposes loading/error state.
 * `deps` re-runs the fetch when any dependency changes (same rules as useEffect).
 *
 * Always re-fetches when the tab regains focus/visibility (cheap, event-driven
 * — catches changes made elsewhere, e.g. another session, without polling).
 * Pass `pollMs` for pages where staleness matters enough to also poll on a
 * timer while the tab stays open.
 */
export function useApiResource<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: ApiResourceOptions = {}
): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { pollMs } = options;
  // Background refreshes (poll/focus) shouldn't flip the UI back to a loading
  // state and blank out data that's already on screen — only the initial
  // load and explicit reload() should do that.
  const hasLoadedRef = useRef(false);

  const reload = useCallback(() => {
    let cancelled = false;
    if (!hasLoadedRef.current) setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          hasLoadedRef.current = true;
        }
      })
      .catch(() => {
        // Loading failures aren't actionable user feedback the way a form
        // submission error is — always show a generic message here rather
        // than whatever raw text the backend/network layer produced.
        if (!cancelled) {
          setError("Couldn't load this. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    hasLoadedRef.current = false;
    return reload();
  }, [reload]);

  useEffect(() => {
    function handleVisible() {
      if (document.visibilityState === "visible") reload();
    }
    window.addEventListener("focus", handleVisible);
    document.addEventListener("visibilitychange", handleVisible);
    return () => {
      window.removeEventListener("focus", handleVisible);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [reload]);

  useEffect(() => {
    if (!pollMs) return;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") reload();
    }, pollMs);
    return () => clearInterval(interval);
  }, [pollMs, reload]);

  return { data, loading, error, reload };
}
