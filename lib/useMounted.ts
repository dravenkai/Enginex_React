"use client";

import { useEffect, useState } from "react";

/**
 * True only after the component has actually mounted on the client.
 * Guarantees the very first paint is always identical (`false`) regardless
 * of what Next.js's server render or a stale prefetched/cached client
 * navigation snapshot produced — avoiding hydration mismatches on any
 * attribute derived from state that Next may have already resolved
 * differently in a cached render of this route (e.g. a data-fetching hook's
 * `loading` flag) before this real mount's effects run.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
