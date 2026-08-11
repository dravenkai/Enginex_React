"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "./http";

interface ApiResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Fetches a backend resource on mount and exposes loading/error state.
 * `deps` re-runs the fetch when any dependency changes (same rules as useEffect).
 */
export function useApiResource<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
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

  useEffect(() => reload(), [reload]);

  return { data, loading, error, reload };
}
