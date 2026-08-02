"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, LayoutDashboard, Store, UserRound, X } from "lucide-react";
import styles from "./ClientNavigation.module.css";

type ClientNavigationProps = {
  active?: "dashboard" | "marketplace" | "favorites" | "profile";
  mobileOpen?: boolean;
  onClose?: () => void;
};

const links = [
  { key: "dashboard", label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { key: "marketplace", label: "Marketplace", href: "/client/marketplace/marketplace-menu", icon: Store },
  { key: "favorites", label: "Favorites", href: "/client/marketplace/marketplace-fav", icon: Heart },
  { key: "profile", label: "Profile", href: "/client/dashboard/manage-indentity", icon: UserRound },
] as const;

export default function ClientNavigation({ active = "dashboard", mobileOpen = false, onClose }: ClientNavigationProps) {
  return <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`} aria-label="Client navigation">
    <div className={styles.brand}><Image src="/enginex-logo.png" width={38} height={38} alt="Enginex" /><div><strong>Enginex</strong><span>Client Site</span></div></div>
    <button type="button" className={styles.close} onClick={onClose} aria-label="Close navigation"><X /></button>
    <nav>{links.map(({ key, label, href, icon: Icon }) => <Link key={key} href={href} className={active === key ? styles.active : ""} aria-current={active === key ? "page" : undefined}><Icon />{label}</Link>)}</nav>
    <Link className={styles.newRequest} href="/client/marketplace/assign-project">New Request</Link>
  </aside>;
}
