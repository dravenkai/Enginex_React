"use client";

import { useState } from "react";
import { Bell, CheckCircle2, XCircle } from "lucide-react";
import { useEngineerNotifications } from "@/lib/notifications/useEngineerNotifications";

function formatWhen(createdAt?: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useEngineerNotifications();
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
                No notifications yet — you&apos;ll see updates here when a client accepts or rejects one of
                your applications.
              </p>
            ) : (
              <ul className="max-h-96 overflow-y-auto divide-y-2 divide-black">
                {notifications.map((notification) => (
                  <li key={notification.id} className="flex items-start gap-3 p-4">
                    {notification.status === "ACCEPTED" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        Your application for{" "}
                        <span className="font-bold">project #{notification.projectId}</span> was{" "}
                        {notification.status === "ACCEPTED" ? "accepted" : "rejected"}.
                      </p>
                      {notification.createdAt && (
                        // The backend only gives us the application's original
                        // submission time, not when it was reviewed — shown as
                        // context rather than an exact "reviewed at" timestamp.
                        <p className="text-[10px] text-gray-500 mt-1">
                          Applied {formatWhen(notification.createdAt)}
                        </p>
                      )}
                    </div>
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
