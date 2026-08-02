"use client";

import { Bell, BriefcaseBusiness, Camera, Mail, MapPin, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EngineerNavigation from "@/components/layout/EngineerNavigation";
import styles from "../profile.module.css";

export default function EngineerAccountPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className={styles.app}>
    <EngineerNavigation active="profile" mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className={styles.main}>
      <header className={styles.topbar}><button type="button" className={styles.menu} onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button><strong>Account</strong><div><button type="button" aria-label="Notifications"><Bell /></button><span>KN</span></div></header>
      <main className={styles.content}>
        <div className={styles.profileGrid}>
          <section className={styles.profileCard}>
            <Link className={styles.edit} href="/engineer/profile/manage-identity">Edit Profile</Link>
            <div className={styles.avatar}><UserRound /><button type="button" aria-label="Change profile photo"><Camera /></button></div>
            <div className={styles.details}><h1>Khant Nyar Thwin</h1><ul><li><BriefcaseBusiness />Civil Engineer</li><li><MapPin />Mandalay Township</li><li><Mail />m.thorne@horizonsystems.io</li></ul><div className={styles.rule} /><p>Senior Infrastructure Director focused on scaling distributed cloud architectures. Dedicated to building reliable, high-performance systems for global enterprises.</p></div>
          </section>
          <section className={styles.projects}><span>Active Projects</span><strong>12</strong><button type="button">View All Projects</button></section>
        </div>
        <section className={styles.security}><div><h2>Account Security</h2><p>Your profile is currently protected by Two-Factor Authentication. Keep your contact information updated to ensure project continuity.</p></div><div><button type="button">Security Log</button><button type="button">Manage Keys</button></div></section>
      </main>
    </div>
    {menuOpen && <button type="button" className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
  </div>;
}
