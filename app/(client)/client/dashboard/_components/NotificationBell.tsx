"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, UserPlus } from "lucide-react";
import { useClientNotifications } from "@/lib/notifications/useClientNotifications";

function formatWhen(createdAt?: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useClientNotifications();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen((current) => {
      const next = !current;
      if (next) markAllRead();
      return next;
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={toggle}
        className="relative p-2 hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Click-outside catcher */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 top-full mt-2 w-80 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
            <div className="px-4 py-3 border-b-2 border-black">
              <h2 className="font-bold text-sm uppercase">Notifications</h2>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                No notifications yet — you&apos;ll see updates here when an engineer applies to one of your
                open requests.
              </p>
            ) : (
              <ul className="max-h-96 overflow-y-auto divide-y-2 divide-black">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <Link
                      href={`/client/my-projects/${notification.projectId}`}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          <span className="font-bold">{notification.engineerName ?? "An engineer"}</span>{" "}
                          applied to{" "}
                          <span className="font-bold">
                            {notification.projectTitle ?? `project #${notification.projectId}`}
                          </span>
                          .
                        </p>
                        {notification.createdAt && (
                          <p className="text-[10px] text-gray-500 mt-1">{formatWhen(notification.createdAt)}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
