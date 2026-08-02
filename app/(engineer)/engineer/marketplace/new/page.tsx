"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useMemo, useState } from "react";
import EngineerNavigation from "@/components/layout/EngineerNavigation";
import styles from "./marketplace.module.css";

type Filter = "All" | "Software" | "Mechanical" | "Electrical" | "Available Now";
const projects = Array.from({ length: 8 }, (_, index) => index % 2 === 0 ? {
  id: `bridge-${index}`, category: "Mechanical" as Filter, title: "Bridge Structural Analysis", year: "2023", image: "bridge", description: "Seismic load calculation and stress testing for the Northside Transit Link.",
} : {
  id: `hvac-${index}`, category: "Available Now" as Filter, title: "Industrial HVAC Design", year: "2022", image: "factory", description: "Efficient thermodynamic routing for a 50,000 sq ft manufacturing plant.",
});

export default function EngineerMarketplacePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => projects.filter((project) => (filter === "All" || project.category === filter) && (!query.trim() || `${project.title} ${project.description}`.toLowerCase().includes(query.toLowerCase()))), [filter, query]);
  return <div className={styles.app}><EngineerNavigation active="marketplace" mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} /><div className={styles.main}><header className={styles.topbar}><button type="button" className={styles.menu} onClick={() => setMenuOpen(true)}><Menu /></button><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects..." /></label><div><Bell /><span>KN</span></div></header><main className={styles.content}><h1>Engineer Marketplace</h1><p className={styles.intro}>&quot;Discover active project requests submitted by verified clients.&quot;</p><div className={styles.filters}>{(["All", "Software", "Mechanical", "Electrical", "Available Now"] as Filter[]).map((item) => <button type="button" key={item} className={filter === item ? styles.selected : ""} onClick={() => setFilter(item)}>{filter === item && "✓ "}{item}</button>)}</div><section className={styles.grid}>{visible.map((project) => <article className={styles.card} key={project.id}><div className={`${styles.image} ${styles[project.image]}`} /><div className={styles.cardBody}><header><h2>{project.title}</h2><span>{project.year}</span></header><p>{project.description}</p><button type="button">Case Study</button></div></article>)}{visible.length === 0 && <p className={styles.empty}>No marketplace projects match your filters.</p>}</section></main></div>{menuOpen && <button className={styles.backdrop} onClick={() => setMenuOpen(false)} />}</div>;
}
