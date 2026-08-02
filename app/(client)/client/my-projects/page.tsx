import Link from "next/link";
import base from "../browse-engineers/browse-engineers.module.css";
import styles from "./my-projects.module.css";

function Icon({ name }: { name: "plus" | "bell" | "user" | "logout" }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const projects = [
  { name: "Office Building Renovation", engineer: "Sarah Johnson", status: "IN PROGRESS", statusClass: "progress", budget: "$45,000" },
  { name: "Bridge Inspection Report", engineer: "David Kumar", status: "COMPLETED", statusClass: "completed", budget: "$12,500" },
  { name: "HVAC System Design", engineer: "Michael Chen", status: "PENDING", statusClass: "pending", budget: "$28,000" },
] as const;

export default function MyProjectsPage() {
  return <main className={base.page}>
    <header className={base.header}>
      <Link className={base.brand} href="/client/browse-engineers"><span><Icon name="plus"/></span>ENGINEX CLIENT HUB</Link>
      <nav className={base.actions} aria-label="Account controls">
        <button className={base.notification} type="button" aria-label="Notifications"><Icon name="bell"/><i/></button>
        <Link href="/client/profile"><Icon name="user"/><span>Client Account</span></Link>
        <button type="button"><Icon name="logout"/><span>Logout</span></button>
      </nav>
    </header>

    <div className={base.content}>
      <nav className={base.tabs} aria-label="Client account sections">
        <Link href="/client/browse-engineers">BROWSE ENGINEERS</Link>
        <Link className={base.activeTab} href="/client/my-projects">MY PROJECTS</Link>
        <button type="button">CONTRACTS</button>
      </nav>

      <section className={styles.projects}>
        <div className={styles.sectionHeader}><h1>Active Projects</h1><button type="button"><span>＋</span> NEW PROJECT</button></div>
        <div className={styles.list}>
          {projects.map((project) => <article className={styles.card} key={project.name}>
            <div className={styles.info}><h2>{project.name}</h2><div><span className={styles[project.statusClass]}>{project.status}</span><p>Engineer: {project.engineer}</p></div></div>
            <div className={styles.cardActions}><strong>{project.budget}</strong><button type="button">VIEW DETAILS</button></div>
          </article>)}
        </div>
      </section>
    </div>
  </main>;
}
