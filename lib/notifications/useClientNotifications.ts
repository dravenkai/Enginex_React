"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listClientProjects,
  listProjectApplications,
  type ClientProject,
  type ProjectApplicationEntry,
} from "@/lib/api/clients";
import { useAuthStore } from "@/lib/auth/store";

export interface ClientNotification {
  id: string;
  applicationId: number;
  projectId: number;
  projectTitle?: string;
  engineerName?: string;
  createdAt?: string;
  read: boolean;
}

// Same derived-from-existing-data approach as useEngineerNotifications:
// there's no backend notifications endpoint, so this polls each of the
// client's OPEN projects' applications and surfaces every still-PENDING one
// as "a new application came in, go review it" — that's the event a client
// actually needs to act on (accepted/rejected applications aren't actionable
// anymore, so they're not worth alerting on here).
const READ_IDS_KEY = "enginex.clientNotifications.readIds";
const POLL_MS = 30000;

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

export function useClientNotifications() {
  const hasSession = useAuthStore((state) => Boolean(state.accessToken));
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [applicationsByProject, setApplicationsByProject] = useState<
    Record<number, ProjectApplicationEntry[]>
  >({});
  // Starts empty (matching the server-rendered HTML) and loads the real
  // stored set after mount — reading localStorage eagerly in the useState
  // initializer runs during hydration too and can render different content
  // than the server did, which is a hydration mismatch.
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  const load = useCallback(async () => {
    try {
      const projectList = await listClientProjects();
      setProjects(projectList);
      // Only OPEN projects can still receive new applications, so that's all
      // that's worth polling here.
      const openProjects = projectList.filter((project) => project.status === "OPEN");
      const entries = await Promise.all(
        openProjects.map(async (project): Promise<[number, ProjectApplicationEntry[]]> => {
          try {
            return [project.id, await listProjectApplications(project.id)];
          } catch {
            return [project.id, []];
          }
        })
      );
      setApplicationsByProject(Object.fromEntries(entries));
    } catch {
      // Best effort — notifications just won't update this cycle. This also
      // covers the logged-out/expired-session case (401) without any special
      // handling, since the next poll simply tries again.
    }
  }, []);

  useEffect(() => {
    // Without a session there's nothing to poll for — skip both the fetch
    // and the interval instead of hammering endpoints that can only 401.
    if (!hasSession) {
      setProjects([]);
      setApplicationsByProject({});
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

  const projectTitleById = new Map(projects.map((project) => [project.id, project.title]));

  const notifications: ClientNotification[] = Object.values(applicationsByProject)
    .flat()
    .filter((application) => application.status === "PENDING")
    .map((application) => {
      const id = `application-${application.id}`;
      return {
        id,
        applicationId: application.id,
        projectId: application.projectId,
        projectTitle: projectTitleById.get(application.projectId),
        engineerName: application.engineer?.name,
        createdAt: application.createdAt,
        read: readIds.has(id),
      };
    })
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
