"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChartNoAxesCombined,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import styles from "./Sidebar.module.css";

export type SidebarItem =
  | "Dashboard"
  | "Projects"
  | "Analytics"
  | "Team"
  | "Settings";

type NavigationItem = {
  label: SidebarItem;
  icon: LucideIcon;
};

type SidebarProps = {
  onSelectionChange?: (item: SidebarItem) => void;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];

export default function Sidebar({ onSelectionChange }: SidebarProps) {
  // Temporary local navigation state; this can be replaced by route state later.
  const [activeItem, setActiveItem] = useState<SidebarItem>("Dashboard");

  function selectItem(item: SidebarItem) {
    setActiveItem(item);
    onSelectionChange?.(item);
  }

  return (
    <aside className={styles.sidebar} aria-label="Primary sidebar">
      <header className={styles.brand}>
        <Image
          className={styles.logo}
          src="/enginex-logo.png"
          alt="Enginex logo"
          width={52}
          height={52}
          priority
        />
        <div className={styles.brandText}>
          <strong>Enginex</strong>
          <span>Client Site</span>
        </div>
      </header>

      <nav className={styles.navigation} aria-label="Main navigation">
        <ul className={styles.menuList}>
          {navigationItems.map(({ label, icon: Icon }) => {
            const isActive = activeItem === label;

            return (
              <li key={label}>
                <button
                  type="button"
                  className={`${styles.menuItem} ${
                    isActive ? styles.active : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => selectItem(label)}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <button type="button" className={styles.newRequestButton}>
        New Request
      </button>
    </aside>
  );
}
