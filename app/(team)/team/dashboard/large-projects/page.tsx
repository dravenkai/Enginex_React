import Link from "next/link";
import dashboard from "../dashboard.module.css";
import styles from "./large-projects.module.css";

function Icon({ name }: { name: "plus" | "bell" | "user" | "logout" | "team" }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
    team: <><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2M15 14a5 5 0 0 1 7 4v2"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const statistics = [
  { value: "24", label: "TEAM MEMBERS", color: "blue" },
  { value: "11", label: "ACTIVE PROJECTS", color: "yellow" },
  { value: "$8.4M", label: "THIS QUARTER", color: "green" },
  { value: "94%", label: "SUCCESS RATE", color: "white" },
] as const;

const projects = [
  { name: "Metro Station Complex", budget: "$2.5M", engineers: 8, progress: 65 },
  { name: "Corporate Campus Phase 2", budget: "$4.2M", engineers: 12, progress: 40 },
  { name: "Water Treatment Facility", budget: "$1.8M", engineers: 6, progress: 85 },
] as const;

export default function LargeProjectsPage() {
  return (
    <main className={dashboard.page}>
      <header className={dashboard.header}>
        <Link className={dashboard.brand} href="/team/dashboard"><span className={dashboard.brandIcon}><Icon name="plus"/></span><span>ENGINEX TEAM COMMAND</span></Link>
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
          <Link className={dashboard.activeTab} href="/team/dashboard/large-projects">LARGE PROJECTS</Link>
          <button type="button">RECRUIT ENGINEERS</button>
        </nav>

        <section className={styles.projectList} aria-label="Large projects">
          {projects.map((project) => (
            <article className={styles.projectCard} key={project.name}>
              <div className={styles.projectHeader}>
                <div><h1>{project.name}</h1><div className={styles.meta}><span>Budget:</span><strong>{project.budget}</strong><span className={styles.engineers}><Icon name="team"/>{project.engineers} Engineers</span></div></div>
                <button type="button">PROJECT DETAILS</button>
              </div>
              <div className={styles.progressHeading}><strong>PROGRESS</strong><span>{project.progress}%</span></div>
              <div className={styles.track} role="progressbar" aria-label={`${project.name} progress`} aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${project.progress}%` }}/></div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
