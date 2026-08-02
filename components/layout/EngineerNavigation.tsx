"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Mail, Search, Store, UserRound, X } from "lucide-react";
import styles from "./EngineerNavigation.module.css";

type EngineerNavigationProps = {
  active?: "dashboard" | "marketplace" | "projects" | "team" | "profile";
  mobileOpen?: boolean;
  onClose?: () => void;
};

const links = [
  { key: "dashboard", label: "Dashboard", href: "/engineer/dashboard", icon: LayoutDashboard },
  { key: "marketplace", label: "Marketplace", href: "/engineer/marketplace", icon: Store },
  { key: "projects", label: "My Projects", href: "/engineer/marketplace/new", icon: Mail },
  { key: "team", label: "Find Team", href: "/engineer/marketplace", icon: Search },
  { key: "profile", label: "Profile", href: "/engineer/profile/acc", icon: UserRound },
] as const;

export default function EngineerNavigation({ active = "dashboard", mobileOpen = false, onClose }: EngineerNavigationProps) {
  return <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`} aria-label="Engineer navigation">
    <div className={styles.brand}><Image src="/enginex-logo.png" width={39} height={39} alt="Enginex" priority /><div><strong>Enginex</strong><span>Engineer Site</span></div></div>
    <button type="button" className={styles.close} onClick={onClose} aria-label="Close navigation"><X /></button>
    <nav>{links.map(({ key, label, href, icon: Icon }) => <Link key={key} href={href} className={active === key ? styles.active : ""} aria-current={active === key ? "page" : undefined}><Icon />{label}</Link>)}</nav>
  </aside>;
}
