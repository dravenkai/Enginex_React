"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck, Bell, BellRing, Bold, ChevronRight, FileUp, Italic, LayoutDashboard,
  Link as LinkIcon, List, Mail, Menu, Search, Share2, Store,
  Trash2, UserRound, X,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import styles from "./profile.module.css";

export default function EngineerProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portfolio, setPortfolio] = useState("Khant Nyar Thwin Portfolio.pdf");
  const [alerts, setAlerts] = useState({ projects: true, marketplace: true, community: false });
  const portfolioInput = useRef<HTMLInputElement>(null);

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return <div className={styles.app}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
      <div className={styles.brand}><Image src="/enginex-logo.png" width={40} height={40} alt="Enginex" priority /><div><strong>Enginex</strong><span>Engineer Site</span></div></div>
      <button type="button" className={styles.close} onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
      <nav>
        <Link href="/engineer/dashboard"><LayoutDashboard />Dashboard</Link>
        <Link href="/engineer/marketplace"><Store />Marketplace</Link>
        <Link href="/engineer/marketplace/new"><Mail />My Projects</Link>
        <Link href="/engineer/marketplace"><Search />Find Team</Link>
        <Link className={styles.active} href="/engineer/profile"><UserRound />Profile</Link>
      </nav>
    </aside>

    <div className={styles.main}>
      <header className={styles.topbar}><button type="button" className={styles.menu} onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button><strong>Account</strong><div><button type="button" aria-label="Notifications"><Bell /></button><span>KN</span></div></header>

      <form onSubmit={saveProfile} onReset={() => setSaved(false)}>
        <main className={styles.content}>
          <div className={styles.heading}><div><h1>Manage Identity</h1><p>Update your professional presence on Enginex.</p></div><div className={styles.headingActions}><button type="reset">Cancel</button><button type="submit">Save Changes</button></div></div>

          <div className={styles.grid}>
            <section className={`${styles.panel} ${styles.identity}`}>
              <div className={styles.photo}><UserRound /><button type="button">Change Photo</button></div>
              <div className={styles.identityFields}><label>Full Name<input name="name" defaultValue="Khant Nyar Thwin" /></label><div><label>Job<input name="job" defaultValue="Student" /></label><label>Company<input name="company" defaultValue="-" /></label></div></div>
              <label className={styles.bio}>Professional Bio<div className={styles.editor}><div><Bold /><Italic /><List /><LinkIcon /></div><textarea name="bio" defaultValue="Specializing in high-precision aerospace components and structural optimization. Over 12 years of experience leading cross-functional teams in complex digital manufacturing environments. Dedicated to engineering excellence and transparency in project management." /></div></label>
            </section>

            <div className={styles.rightRail}>
              <section className={`${styles.panel} ${styles.portfolio}`}><h2><span>Portfolio</span><small>PDF (MAX 50MB)</small></h2><input ref={portfolioInput} type="file" accept="application/pdf" onChange={(event) => setPortfolio(event.target.files?.[0]?.name ?? portfolio)} /><button type="button" onClick={() => portfolioInput.current?.click()}><span><FileUp /></span><span>{portfolio}<small>( 24 mb )</small></span></button></section>
              <section className={`${styles.panel} ${styles.security}`}><h2><BadgeCheck />Security</h2><button type="button" className={styles.password}>Change Password<ChevronRight /></button><label>Preferred Language<select defaultValue="English"><option>English</option><option>Myanmar</option><option>Japanese</option></select></label><button type="button" className={styles.deactivate}><Trash2 /><span>Deactivate<br />Account</span></button></section>
            </div>

            <section className={`${styles.panel} ${styles.alerts}`}><h2><BellRing />Alerts</h2>{([
              ["projects", "Project Updates", "New milestones and engineering review notifications."],
              ["marketplace", "Marketplace Alerts", "Price fluctuations and new available manufacturing slots."],
              ["community", "Community News", "Weekly digest of Enginex ecosystem developments."],
            ] as const).map(([key, title, detail]) => <label className={styles.check} key={key}><input type="checkbox" checked={alerts[key]} onChange={(event) => setAlerts((current) => ({ ...current, [key]: event.target.checked }))} /><span><strong>{title}</strong><small>{detail}</small></span></label>)}</section>

            <section className={`${styles.panel} ${styles.contact}`}><h2><Share2 />Contact</h2><label>Email Address<input type="email" defaultValue="justicforyang@gmail.com" /></label><label>Phone Number<input defaultValue="+95 9988078476" /></label><label>Address<textarea defaultValue={"73st bet 107/108 ChanMyaTharZi,\nMandalay"} /></label></section>

          </div>
          {saved && <div className={styles.toast} role="status">Profile changes saved.</div>}
        </main>
      </form>
    </div>
    {menuOpen && <button type="button" className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
  </div>;
}
