"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { type SidebarItem } from "./Sidebar";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [renderedScreen, setRenderedScreen] =
    useState<SidebarItem>("Dashboard");

  const isAuthPage = ["/login", "/register", "/sign-in", "/forgot-password"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const hasStandaloneShell = [
    "/client/marketplace/marketplace-menu",
    "/client/marketplace/marketplace-fav",
  ].includes(pathname);

  if (isAuthPage || hasStandaloneShell) return children;

  return (
    <div className={styles.shell}>
      <Sidebar onSelectionChange={setRenderedScreen} />

      {/* A fixed element is outside normal flow, so the matching left margin
          prevents every screen from rendering underneath the sidebar. */}
      <div className={styles.mainContent}>
        <div className={styles.screenHeader} aria-live="polite">
          Rendered: {renderedScreen} Screen
        </div>
        <div className={styles.pageContent}>{children}</div>
      </div>
    </div>
  );
}
