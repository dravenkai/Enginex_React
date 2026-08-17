"use client";

import { useCallback, useEffect, useState } from "react";
import { listMyApplications, type EngineerApplicationEntry } from "@/lib/api/engineers";
import { useAuthStore } from "@/lib/auth/store";

export interface EngineerNotification {
  id: string;
  applicationId: number;
  projectId: number;
  status: "ACCEPTED" | "REJECTED";
  createdAt?: string;
  read: boolean;
}

// There's no backend notifications endpoint, so this derives notifications
// straight from the engineer's own applications: any application that's left
// PENDING is an event worth surfacing (an "accepted" or "rejected" outcome).
// The id embeds the status, so if a client later reverses an acceptance
// (application flips ACCEPTED -> REJECTED), that shows up as a brand new,
// unread "rejected" notification rather than reusing the old accepted one.
const READ_IDS_KEY = "enginex.engineerNotifications.readIds";
const POLL_MS = 20000;

function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(READ_IDS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READ_IDS_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Best effort — read state just won't persist across reloads.
  }
}

function toNotification(application: EngineerApplicationEntry, readIds: Set<string>): EngineerNotification | null {
  if (application.status !== "ACCEPTED" && application.status !== "REJECTED") return null;
  const id = `application-${application.id}-${application.status}`;
  return {
    id,
    applicationId: application.id,
    projectId: application.projectId,
    status: application.status,
    createdAt: application.createdAt,
    read: readIds.has(id),
  };
}

export function useEngineerNotifications() {
  const hasSession = useAuthStore((state) => Boolean(state.accessToken));
  const [applications, setApplications] = useState<EngineerApplicationEntry[]>([]);
  // Starts empty (matching the server-rendered HTML) and loads the real
  // stored set after mount — reading localStorage eagerly in the useState
  // initializer runs during hydration too and can render different content
  // than the server did, which is a hydration mismatch.
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  const load = useCallback(() => {
    listMyApplications()
      .then(setApplications)
      .catch(() => {
        // Best effort — notifications just won't update this cycle. This
        // also covers the logged-out/expired-session case (401) without any
        // special handling, since the next poll simply tries again.
      });
  }, []);

  useEffect(() => {
    // Without a session there's nothing to poll for — skip both the fetch
    // and the interval instead of hammering an endpoint that can only 401.
    if (!hasSession) {
      setApplications([]);
      return;
    }
    load();
    // Matches useApiResource's convention: only poll while the tab is
    // actually visible, so a backgrounded tab doesn't keep firing requests
    // (and doesn't pile on repeated errors during a backend outage).
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [hasSession, load]);

  const notifications = applications
    .map((application) => toNotification(application, readIds))
    .filter((notification): notification is EngineerNotification => notification !== null)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  const unreadCount = notifications.reduce((count, notification) => count + (notification.read ? 0 : 1), 0);

  function markAllRead() {
    setReadIds((current) => {
      const next = new Set(current);
      for (const notification of notifications) next.add(notification.id);
      saveReadIds(next);
      return next;
    });
  }

  return { notifications, unreadCount, markAllRead };
}
