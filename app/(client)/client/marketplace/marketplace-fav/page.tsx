"use client";

import { Bell, CalendarDays, Heart, LayoutDashboard, Menu, PlusCircle, Search, Settings, Store, UserRound, UsersRound, X, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./marketplace-fav.module.css";

type Kind = "All" | "Solo" | "Teams";
const initialFavorites = [
  { id: 1, kind: "Solo" as const, name: "Sarah Jenkins", rating: 4.9, label: "Solo Expert", tags: ["Structural", "Seismic Design"], copy: "Expert in residential retrofitting and high-rise", art: "sarah", action: "calendar" },
  { id: 2, kind: "Teams" as const, name: "Vortex Civil Group", rating: 5.0, label: "Full Team", tags: ["Infrastructure", "Civil", "BIM"], copy: "Full-cycle civil infrastructure team with proven delivery", art: "team", action: "team" },
  { id: 3, kind: "Solo" as const, name: "Marcus T.", rating: 4.8, label: "Solo Expert", tags: ["Electrical", "HVAC Control"], copy: "Specialist in industrial electrical automation and controls", art: "marcus", action: "zap" },
];

export default function MarketplaceFavoritesPage() {
  const [tab, setTab] = useState<Kind>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Recently Added");
  const [items, setItems] = useState(initialFavorites);
  const [menuOpen, setMenuOpen] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = items.filter((item) => (tab === "All" || item.kind === tab) && (!needle || [item.name, item.copy, ...item.tags].join(" ").toLowerCase().includes(needle)));
    return [...result].sort((a, b) => sort === "Rating" ? b.rating - a.rating : sort === "Name" ? a.name.localeCompare(b.name) : a.id - b.id);
  }, [items, query, sort, tab]);

  return <div className={styles.app}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
      <div className={styles.brand}><strong>ENGINEX</strong><span>Client Suite</span></div>
      <button className={styles.close} onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
      <nav><a href="/client/dashboard"><LayoutDashboard />Dashboard</a><a href="/client/marketplace/marketplace-menu"><Store />Marketplace</a><a className={styles.active} href="/client/marketplace/marketplace-fav"><Heart fill="currentColor" />Favorites</a><a href="/client/profile"><UserRound />Profile</a></nav>
      <button className={styles.newRequest}>New Request</button>
    </aside>

    <div className={styles.main}>
      <header className={styles.header}>
        <button className={styles.menu} onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
        <h1>Saved Favorites</h1>
        <label className={styles.search}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search favorites..." /></label>
        <button className={styles.iconButton} aria-label="Notifications"><Bell /></button><button className={styles.iconButton} aria-label="Settings"><Settings /></button><div className={styles.avatar}>EX</div>
      </header>

      <main className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.tabs}>{(["All", "Solo", "Teams"] as Kind[]).map((item) => <button key={item} className={tab === item ? styles.selected : ""} onClick={() => setTab(item)}>{item} ({item === "All" ? items.length : items.filter((fav) => fav.kind === item).length})</button>)}</div>
          <label className={styles.sort}>Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recently Added</option><option>Rating</option><option>Name</option></select></label>
        </div>

        <section className={styles.grid} aria-live="polite">
          {visible.map((item) => <article className={styles.card} key={item.id}>
            <div className={`${styles.cardArt} ${styles[item.art]}`}><span>{item.label}</span><button onClick={() => setItems((current) => current.filter((fav) => fav.id !== item.id))} aria-label={`Remove ${item.name} from favorites`}><Heart fill="currentColor" /></button><div className={styles.figure}><UserRound /></div></div>
            <div className={styles.cardBody}><h2>{item.name}<span>★ <small>{item.rating.toFixed(1)}</small></span></h2><div className={styles.tags}>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p>{item.copy}...</p>
              <div className={styles.actions}><button>Message</button><button aria-label={`Open ${item.name} details`}>{item.action === "calendar" ? <CalendarDays /> : item.action === "team" ? <UsersRound /> : <Zap />}</button></div>
            </div>
          </article>)}
          <a className={styles.browse} href="/client/marketplace/marketplace-menu"><PlusCircle /><strong>Browse<br />Marketplace</strong><span>Discover more engineers to add to your favorites.</span></a>
        </section>
        <button className={styles.loadMore}>Load More Favorites</button>
      </main>
    </div>
    {menuOpen && <button className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
  </div>;
}
