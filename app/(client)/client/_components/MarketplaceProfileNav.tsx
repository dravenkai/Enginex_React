import Link from "next/link";
import styles from "./marketplace-profile-nav.module.css";

function Icon({ name }: { name: "grid" | "market" | "heart" | "user" | "bell" | "settings" | "back" }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    market: <><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M3 10c1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 3 5 0"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
    back: <><path d="M20 12H5M10 6l-6 6 6 6"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function EnginexLogo() {
  return <svg aria-label="Enginex logo" viewBox="0 0 100 90">
    <path fill="#2b9ed0" stroke="none" d="M8 74c5-20 17-35 35-42V20L70 3v37c-6 1-11 3-16 6V17l-7 5v27C30 54 20 64 17 79Z"/>
    <path fill="#43bd95" stroke="none" d="M18 76c10-13 23-19 38-17 10 1 20-5 27-18-2 21-13 34-34 36-10 1-18 5-24 11Z"/>
    <path fill="#ed9231" stroke="none" d="M39 66h43C76 81 64 88 47 87c-11 0-20-5-25-13 6 3 12 4 17 3Z"/>
    <rect x="51" y="28" width="5" height="5" fill="#fff" stroke="none"/><rect x="61" y="22" width="5" height="5" fill="#fff" stroke="none"/><rect x="61" y="32" width="5" height="5" fill="#fff" stroke="none"/>
    <circle cx="66" cy="62" r="5" fill="#2b9ed0" stroke="none"/><path fill="#2b9ed0" stroke="none" d="M59 75c0-6 3-10 7-10s7 4 7 10"/>
  </svg>;
}

export default function MarketplaceProfileNav({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <Link className={styles.logo} href="/client/dashboard"><EnginexLogo/><div><strong>Enginex</strong><small>Client Site</small></div></Link>
      <nav><Link href="/client/dashboard"><Icon name="grid"/>Dashboard</Link><Link className={styles.active} href="/client/marketplace"><Icon name="market"/>Marketplace</Link><Link href="#"><Icon name="heart"/>Favorites</Link><Link href="/client/profile"><Icon name="user"/>Profile</Link></nav>
      <Link className={styles.request} href="/client/dashboard/new-request">NEW REQUEST</Link>
    </aside>
    <section className={styles.main}>
      <header className={styles.topbar}><Link href="/client/marketplace"><Icon name="back"/>Back</Link><div><Icon name="bell"/><Icon name="settings"/><span/></div></header>
      {children}
    </section>
  </div>;
}
