"use client";

import {
  Bell,
  Check,
  Filter,
  Heart,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./marketplace-menu.module.css";

type Category = "All" | "Software" | "Mechanical" | "Electrical";

const engineers = [
  { id: 1, name: "Marcus Chen", role: "Senior Systems Architect", category: "Software", tags: ["Rust", "Distributed Systems", "AWS"], badge: "Verified", portrait: "MC" },
  { id: 2, name: "Elena Rodriguez", role: "Mechatronics Specialist", category: "Mechanical", tags: ["CAD Design", "Robotics", "Prototyping"], portrait: "ER" },
  { id: 3, name: "Julian Thorne", role: "Embedded Systems Lead", category: "Electrical", tags: ["PCB Design", "C++", "FPGA"], badge: "New", portrait: "JT" },
  { id: 4, name: "Maya Wu", role: "AI Infrastructure Engineer", category: "Software", tags: ["PyTorch", "Kubernetes", "MLOps"], portrait: "MW" },
];

export default function MarketplaceMenuPage() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([4]);
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleEngineers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return engineers.filter((engineer) => {
      const categoryMatches = category === "All" || engineer.category === category;
      const searchMatches = !needle || [engineer.name, engineer.role, ...engineer.tags].join(" ").toLowerCase().includes(needle);
      return categoryMatches && searchMatches;
    });
  }, [category, query]);

  function toggleFavorite(id: number) {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  return (
    <div className={styles.app}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}><strong>ENGINEX</strong><span>Client Suite</span></div>
        <button className={styles.closeMenu} onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        <nav aria-label="Client navigation">
          <a href="/client/dashboard"><LayoutDashboard />Dashboard</a>
          <a className={styles.activeNav} href="/client/marketplace/marketplace-menu"><Store />Marketplace</a>
          <a href="#favorites"><Heart />Favorites</a>
          <a href="/client/profile"><UserRound />Profile</a>
        </nav>
        <button className={styles.newRequest}><Plus />New Request</button>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <label className={styles.search}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for engineers..." /></label>
          <div className={styles.topActions}><button aria-label="Notifications"><Bell /></button><button aria-label="Settings"><Settings /></button><div className={styles.userAvatar}>EX</div></div>
        </header>

        <main className={styles.content}>
          <section className={styles.intro}>
            <h1>Engineer Marketplace</h1>
            <p>Find world-class technical talent for your next project.<br />Verified experts in software, mechanics, and electronics ready to build.</p>
          </section>

          <section className={styles.filters} aria-label="Engineer filters">
            <div className={styles.categories}>
              {(["All", "Software", "Mechanical", "Electrical"] as Category[]).map((item) => (
                <button key={item} className={category === item ? styles.selectedFilter : ""} onClick={() => setCategory(item)}>
                  {item === "All" && category === item && <Check />} {item}
                </button>
              ))}
              <button className={styles.available}>Available Now</button>
            </div>
            <button className={styles.moreFilters}><Filter />More Filters</button>
          </section>

          <section className={styles.grid} id="favorites">
            {visibleEngineers.map((engineer) => {
              const favorite = favorites.includes(engineer.id);
              return (
                <article className={styles.card} key={engineer.id}>
                  <div className={styles.cardTop}>
                    <div className={styles.portrait}><UserRound aria-hidden="true" /><span>{engineer.portrait}</span></div>
                    <button className={`${styles.favorite} ${favorite ? styles.favoriteActive : ""}`} onClick={() => toggleFavorite(engineer.id)} aria-label={`${favorite ? "Remove" : "Add"} ${engineer.name} ${favorite ? "from" : "to"} favorites`}><Heart fill={favorite ? "currentColor" : "none"} /></button>
                  </div>
                  <h2>{engineer.name} {engineer.badge && <small className={engineer.badge === "New" ? styles.newBadge : ""}>{engineer.badge}</small>}</h2>
                  <p>{engineer.role}</p>
                  <div className={styles.tags}>{engineer.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className={styles.cardActions}><button>Request<br />Service</button><button>View<br />Profile</button></div>
                </article>
              );
            })}
            {visibleEngineers.length === 0 && <p className={styles.empty}>No engineers match your search.</p>}
          </section>

          <button className={styles.discover}>Discover More Experts</button>
        </main>
      </div>
      {menuOpen && <button className={styles.backdrop} aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}
