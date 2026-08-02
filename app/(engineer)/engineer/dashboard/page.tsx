"use client";

import { Bell, CircleGauge, Grid2X2, Menu, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import EngineerNavigation from "@/components/layout/EngineerNavigation";
import styles from "./dashboard.module.css";

const requests = [
  { id: "REQ-4021", status: "Matching", tone: "yellow", title: "Cloud Migration Strategy", description: "Azure to AWS transition for high-traffic e-commerce...", person: "+5", action: "Manage" },
  { id: "REQ-3892", status: "In Progress", tone: "orange", title: "Python Security Audit", description: "Pentesting core API endpoints and SQL optimization...", person: "Sarah L.", action: "Message" },
  { id: "REQ-3770", status: "Final Review", tone: "blue", title: "React Frontend Refactor", description: "Implementing new Design System tokens and hooks...", person: "Mike T.", action: "Approve" },
] as const;

export default function EngineerDashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const visibleRequests = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return requests.filter((request) => !needle || `${request.title} ${request.description} ${request.id}`.toLowerCase().includes(needle));
  }, [query]);

  return <div className={styles.app}>
    <EngineerNavigation active="dashboard" mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className={styles.main}>
      <header className={styles.topbar}><button type="button" className={styles.menu} onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." /></label><div><button type="button" aria-label="Notifications"><Bell /></button><span>KN</span></div></header>
      <main className={styles.content}>
        <div className={styles.heroGrid}>
          <section className={styles.welcome}><h1>Welcome back, Khant Nyar.</h1><p>You have 3 active requests and 12 engineers are currently reviewing your latest post. Everything is running smoothly.</p></section>
          <section className={styles.status}><CircleGauge /><strong>System Status</strong><span>Optimized</span></section>
        </div>

        <section className={styles.requests}><header><h2><Grid2X2 />Active Requests</h2><button type="button">View All</button></header><div className={styles.cards}>
          {visibleRequests.map((request) => <article className={styles.card} key={request.id}><div className={styles.cardTop}><span className={styles[request.tone]}>{request.status}</span><small>#{request.id}</small></div><h3>{request.title}</h3><p>{request.description}</p><footer><span><UserRound />{request.person}</span><button type="button">{request.action}</button></footer></article>)}
          {visibleRequests.length === 0 && <p className={styles.empty}>No active requests match your search.</p>}
        </div></section>
      </main>
    </div>
    {menuOpen && <button type="button" className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
  </div>;
}
