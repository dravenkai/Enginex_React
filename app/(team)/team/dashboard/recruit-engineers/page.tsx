import Link from "next/link";
import dashboard from "../dashboard.module.css";
import styles from "./recruit-engineers.module.css";

function Icon({ name }: { name: "plus" | "bell" | "user" | "logout" | "recruit" }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
    recruit: <><circle cx="9" cy="8" r="4"/><path d="M2 21v-2a7 7 0 0 1 7-7M18 8v8M14 12h8"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const statistics = [
  { value: "24", label: "TEAM MEMBERS", color: "blue" },
  { value: "11", label: "ACTIVE PROJECTS", color: "yellow" },
  { value: "$8.4M", label: "THIS QUARTER", color: "green" },
  { value: "94%", label: "SUCCESS RATE", color: "white" },
] as const;

export default function RecruitEngineersPage() {
  return (
    <main className={dashboard.page}>
      <header className={dashboard.header}>
        <Link className={dashboard.brand} href="/team/dashboard">
          <span className={dashboard.brandIcon}><Icon name="plus"/></span>
          <span>ENGINEX TEAM COMMAND</span>
        </Link>
        <nav className={dashboard.actions} aria-label="Account controls">
          <button className={`${dashboard.actionButton} ${dashboard.notification}`} type="button" aria-label="Notifications"><Icon name="bell"/><span className={dashboard.badge}/></button>
          <Link className={dashboard.actionButton} href="/team"><Icon name="user"/><span>Team Account</span></Link>
          <button className={dashboard.actionButton} type="button"><Icon name="logout"/><span>Logout</span></button>
        </nav>
      </header>

      <div className={dashboard.body}>
        <section className={dashboard.stats} aria-label="Team statistics">
          {statistics.map((stat) => <article className={`${dashboard.stat} ${dashboard[stat.color]}`} key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
        </section>

        <nav className={dashboard.tabs} aria-label="Dashboard sections">
          <Link href="/team/dashboard">TEAM MEMBERS</Link>
          <Link href="/team/dashboard/large-projects">LARGE PROJECTS</Link>
          <Link className={dashboard.activeTab} href="/team/dashboard/recruit-engineers">RECRUIT ENGINEERS</Link>
        </nav>

        <section className={styles.recruit}>
          <Icon name="recruit"/>
          <h1>Recruit Solo Engineers</h1>
          <p>Browse and recruit talented engineers to join your team.</p>
          <Link href="/engineer">BROWSE ENGINEERS</Link>
        </section>
      </div>
    </main>
  );
}
