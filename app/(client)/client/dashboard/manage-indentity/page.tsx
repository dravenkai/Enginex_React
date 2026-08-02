"use client";

import Image from "next/image";
import { Bell, BellRing, Bold, ChevronRight, Heart, Italic, LayoutDashboard, Link as LinkIcon, List, Menu, Network, Settings, Settings2, ShieldCheck, Store, Trash2, UserRound, X } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./manage-indentity.module.css";

export function ManageIdentityScreen({ accountMode = false }: { accountMode?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alerts, setAlerts] = useState({ projects: true, marketplace: true, community: false });

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return <div className={styles.app}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
      <div className={styles.brandHeader}><Image src="/enginex-logo.png" width={38} height={38} alt="Enginex" priority /><div className={styles.brand}><strong>Enginex</strong><span>Client Site</span></div></div>
      <button className={styles.close} onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
      <nav><a href="/client/dashboard"><LayoutDashboard />Dashboard</a><a href="/client/marketplace/marketplace-menu"><Store />Marketplace</a><a href="/client/marketplace/marketplace-fav"><Heart />Favorites</a><a className={styles.active} href={accountMode ? "/client/dashboard/acc-indentity" : "/client/dashboard/manage-indentity"}><UserRound />Profile</a></nav>
      <button className={styles.newRequest}>New Request</button>
    </aside>

    <div className={styles.main}>
      <header className={styles.topbar}><button className={styles.menu} onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button><strong>{accountMode ? "Account" : "Edit Profile"}</strong><div><button aria-label="Notifications"><Bell /></button>{!accountMode && <button aria-label="Settings"><Settings /></button>}<span>EX</span></div></header>
      <form onSubmit={saveProfile}>
        <main className={styles.content}>
          <div className={styles.heading}><div><h1>Manage Identity</h1><p>Update your professional presence on Enginex.</p></div><div className={styles.headingActions}><button type="reset">Cancel</button><button type="submit">Save Changes</button></div></div>

          <div className={styles.layout}>
            <section className={`${styles.panel} ${styles.identity}`}>
              <div className={styles.photo}><UserRound /><button type="button">Change Photo</button></div>
              <div className={styles.identityFields}><label>Full Name<input defaultValue="Khant Nyar Thwin" /></label><div><label>Job<input defaultValue="Student" /></label><label>Company<input defaultValue="-" /></label></div></div>
              <label className={styles.bio}>Professional Bio<div className={styles.editor}><div className={styles.editorTools}><Bold /><Italic /><List /><LinkIcon /></div><textarea defaultValue="Specializing in high-precision aerospace components and structural optimization. Over 12 years of experience leading cross-functional teams in complex digital manufacturing environments. Dedicated to engineering excellence and transparency in project management." /></div></label>
            </section>

            <section className={`${styles.panel} ${styles.security}`}><h2><Settings2 />Security</h2><button type="button" className={styles.changePassword}>Change Password<ChevronRight /></button><label>Preferred Language<select defaultValue="English"><option>English</option><option>Myanmar</option><option>Spanish</option></select></label><button type="button" className={styles.deactivate}><span className={styles.trashIcon}><Trash2 /><X /></span><span>Deactivate<br />Account</span></button></section>

            <section className={`${styles.panel} ${styles.alerts}`}><h2><BellRing />Alerts</h2>{[
              ["projects", "Project Updates", "New milestones and engineering review notifications."],
              ["marketplace", "Marketplace Alerts", "Price fluctuations and new available manufacturing slots."],
              ["community", "Community News", "Weekly digest of Enginex ecosystem developments."],
            ].map(([key, title, copy]) => <label className={styles.check} key={key}><input type="checkbox" checked={alerts[key as keyof typeof alerts]} onChange={(event) => setAlerts((current) => ({ ...current, [key]: event.target.checked }))} /><span><strong>{title}</strong><small>{copy}</small></span></label>)}</section>

            <section className={`${styles.panel} ${styles.contact}`}><h2><Network />Contact</h2><label>Email Address<input type="email" defaultValue="justicforyang@gmail.com" /></label><label>Phone Number<input defaultValue="+95 9988078476" /></label><label>Address<textarea defaultValue={"73st bet 107/108\nChanMyaTharZi, Mandalay"} /></label></section>

            <section className={styles.verification}><h2>Verification Status</h2><p><span>Your profile is currently <u>verified</u> yet. Make</span><span>sure to verify to post requests.</span></p><button type="button">Start Assessment</button><ShieldCheck /></section>
          </div>
          {saved && <div className={styles.toast} role="status">Profile changes saved.</div>}
        </main>
      </form>
      <footer><span>© 2024 Enginex Global Systems. All rights reserved.</span><nav><a href="#">Privacy Policy</a><a href="#">Service Terms</a><a href="#">Contact Support</a></nav></footer>
    </div>
    {menuOpen && <button className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
  </div>;
}

export default function ManageIdentityPage() {
  return <ManageIdentityScreen />;
}
