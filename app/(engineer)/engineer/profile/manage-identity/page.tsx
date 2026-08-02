"use client";

import { BadgeCheck, Bell, BellRing, Bold, ChevronRight, FileUp, Italic, Link as LinkIcon, List, Menu, Share2, Trash2, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import EngineerNavigation from "@/components/layout/EngineerNavigation";
import styles from "./manage-identity.module.css";

export default function ManageIdentityPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alerts, setAlerts] = useState({ projects: true, marketplace: true, community: false });
  function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2400); }
  return <div className={styles.app}>
    <EngineerNavigation active="profile" mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className={styles.main}><header className={styles.topbar}><button type="button" className={styles.menu} onClick={() => setMenuOpen(true)}><Menu /></button><strong>Account</strong><div><Bell /><span>KN</span></div></header>
      <form onSubmit={save}><main className={styles.content}>
        <div className={styles.heading}><div><h1>Manage Identity</h1><p>Update your professional presence on Enginex.</p></div><div><button type="reset">Cancel</button><button type="submit">Save Changes</button></div></div>
        <div className={styles.grid}>
          <section className={`${styles.panel} ${styles.identity}`}><div className={styles.photo}><UserRound /><button type="button">Change Photo</button></div><div className={styles.fields}><label>Full Name<input defaultValue="Khant Nyar Thwin" /></label><div><label>Job<input defaultValue="Student" /></label><label>Company<input defaultValue="-" /></label></div></div><label className={styles.bio}>Professional Bio<div className={styles.editor}><div><Bold /><Italic /><List /><LinkIcon /></div><textarea defaultValue="Specializing in high-precision aerospace components and structural optimization. Over 12 years of experience leading cross-functional teams in complex digital manufacturing environments." /></div></label></section>
          <div className={styles.rightRail}><section className={`${styles.panel} ${styles.portfolio}`}><h2>Portfolio <small>PDF (MAX 50MB)</small></h2><button type="button"><span className={styles.fileIcon}><FileUp /></span><span className={styles.fileName}>Khant Nyar Thwin Portfolio.pdf<small>( 24 mb )</small></span></button></section><section className={`${styles.panel} ${styles.security}`}><h2><BadgeCheck />Security</h2><button type="button" className={styles.password}>Change Password<ChevronRight /></button><label>Preferred Language<select defaultValue="English"><option>English</option><option>Myanmar</option></select></label><button type="button" className={styles.deactivate}><Trash2 /><span>Deactivate<br />Account</span></button></section></div>
          <section className={`${styles.panel} ${styles.alerts}`}><h2><BellRing />Alerts</h2>{([['projects','Project Updates'],['marketplace','Marketplace Alerts'],['community','Community News']] as const).map(([key,title]) => <label className={styles.check} key={key}><input type="checkbox" checked={alerts[key]} onChange={(e) => setAlerts({...alerts,[key]:e.target.checked})}/>{title}</label>)}</section>
          <section className={`${styles.panel} ${styles.contact}`}><h2><Share2 />Contact</h2><label>Email Address<input type="email" defaultValue="justicforyang@gmail.com" /></label><label>Phone Number<input defaultValue="+95 9988078476" /></label><label>Address<textarea defaultValue="73st bet 107/108 ChanMyaTharZi, Mandalay" /></label></section>
        </div>{saved && <div className={styles.toast}>Profile changes saved.</div>}
      </main></form></div>{menuOpen && <button className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
  </div>;
}
