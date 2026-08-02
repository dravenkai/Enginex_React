"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./browse-engineers.module.css";

type IconName = "plus" | "bell" | "user" | "logout" | "search";
function Icon({ name }: { name: IconName }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const engineers = [
  { name: "Sarah Johnson", field: "Civil Engineering", rating: "4.9", projects: 23, rate: "$85/hr" },
  { name: "Michael Chen", field: "Mechanical Engineering", rating: "4.8", projects: 31, rate: "$90/hr" },
  { name: "Emily Rodriguez", field: "Architect Engineering", rating: "5", projects: 18, rate: "$95/hr" },
  { name: "David Kumar", field: "Structural Engineering", rating: "4.7", projects: 27, rate: "$88/hr" },
] as const;

export default function BrowseEngineersPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const filtered = engineers.filter((engineer) => `${engineer.name} ${engineer.field}`.toLowerCase().includes(search.toLowerCase()));
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSearch(query.trim()); }

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/client/browse-engineers"><span><Icon name="plus"/></span>ENGINEX CLIENT HUB</Link>
      <nav className={styles.actions} aria-label="Account controls">
        <button className={styles.notification} type="button" aria-label="Notifications"><Icon name="bell"/><i/></button>
        <Link href="/client/profile"><Icon name="user"/><span>Client Account</span></Link>
        <button type="button"><Icon name="logout"/><span>Logout</span></button>
      </nav>
    </header>
    <div className={styles.content}>
      <nav className={styles.tabs} aria-label="Client account sections"><Link className={styles.activeTab} href="/client/browse-engineers">BROWSE ENGINEERS</Link><button type="button">MY PROJECTS</button><button type="button">CONTRACTS</button></nav>
      <form className={styles.searchForm} onSubmit={submit}><div><Icon name="search"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, field, or expertise..." aria-label="Search engineers"/></div><button type="submit">SEARCH</button></form>
      <section className={styles.grid} aria-label="Available engineers">
        {filtered.map((engineer) => <article className={styles.card} key={engineer.name}><div className={styles.cardTop}><div><h1>{engineer.name}</h1><p>{engineer.field}</p><span>{engineer.rating} • {engineer.projects} Projects</span></div><strong>{engineer.rate}</strong></div><button type="button">VIEW PROFILE &amp; HIRE</button></article>)}
        {filtered.length === 0 && <p className={styles.empty}>No engineers match your search.</p>}
      </section>
    </div>
  </main>;
}
