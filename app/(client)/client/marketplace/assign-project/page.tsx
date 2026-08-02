"use client";

import ClientNavigation from "@/components/layout/ClientNavigation";
import { ArrowLeft, Bell, CalendarDays, ChevronDown, Menu, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./assign-project.module.css";

const projects = ["HVAC Mapping #442", "Soil Analysis - Sector G", "Commercial Tower Retrofit"];

export default function AssignProjectPage() {
  const router = useRouter();
  const [project, setProject] = useState("");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(project ? `Assignment request sent for ${project}.` : "Choose an active project first.");
  }

  return <div className={styles.app}>
    <ClientNavigation active="marketplace" mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className={styles.main}>
      <header className={styles.topbar}><button className={styles.mobileMenu} onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button><button className={styles.back} onClick={() => router.back()}><ArrowLeft />Back</button><div className={styles.topActions}><Bell /><Settings /><span>EX</span></div></header>
      <main className={styles.content}>
        <div className={styles.primary}>
          <section className={styles.intro}><h1>Assign Project to<br />Engineer</h1><p>Detailed specification for engineer <strong>Alex Rivera<br />(Structural Lead)</strong></p></section>
          <form className={styles.assignment} onSubmit={submit}>
            <div className={styles.selector}><h2>Select Your Project</h2><label><select value={project} onChange={(event) => setProject(event.target.value)}><option value="">Choose an active project to assign</option>{projects.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></label><small>Only active projects eligible for structural lead assignment are shown above.</small></div>
            <p>By submitting, you agree to the Enginex<br />Master Service Agreement and data privacy<br />protocols.</p><button type="submit">Send<br />Assignment<br />Request</button>
          </form>
          {message && <div className={styles.toast} role="status">{message}</div>}
        </div>
        <aside className={styles.rail}>
          <section className={styles.requests}><header><span>Existing<br />Requests</span><strong>2<br /><small>Active</small></strong></header><p>Reference current projects to<br />avoid duplicates or link workflows.</p>{projects.slice(0,2).map((item,index) => <button key={item}><span>{item}<small><CalendarDays />Ends: {index ? "Sep 30" : "Oct 12"}</small></span><b>→</b></button>)}<a href="#">View Full History</a></section>
          <section className={styles.engineer}><div className={styles.blueprint}><span /><span /><span /></div><footer><div><UserRound /></div><p><strong>Alex Rivera</strong><small>Top 1% Structural<br />Engineer</small></p></footer></section>
        </aside>
      </main>
    </div>
    {menuOpen && <button className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
  </div>;
}
