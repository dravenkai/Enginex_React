import Link from "next/link";
import styles from "./dashboard.module.css";

type IconName = "plus" | "bell" | "user" | "logout" | "addUser";

function Icon({ name }: { name: IconName }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
    addUser: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M18 8v6M15 11h6"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const statistics = [
  { value: "24", label: "TEAM MEMBERS", color: "blue" },
  { value: "11", label: "ACTIVE PROJECTS", color: "yellow" },
  { value: "$8.4M", label: "THIS QUARTER", color: "green" },
  { value: "94%", label: "SUCCESS RATE", color: "white" },
] as const;

const members = [
  { name: "Alex Rivera", role: "Lead Structural Engineer", projects: 5, status: "ACTIVE" },
  { name: "Jordan Lee", role: "Civil Engineer", projects: 3, status: "ACTIVE" },
  { name: "Taylor Kim", role: "Architect", projects: 4, status: "ON LEAVE" },
  { name: "Morgan Davis", role: "Mechanical Engineer", projects: 6, status: "ACTIVE" },
] as const;

export default function TeamDashboardPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/team/dashboard">
          <span className={styles.brandIcon}><Icon name="plus" /></span>
          <span>ENGINEX TEAM COMMAND</span>
        </Link>
        <nav className={styles.actions} aria-label="Account controls">
          <button className={`${styles.actionButton} ${styles.notification}`} type="button" aria-label="Notifications"><Icon name="bell" /><span className={styles.badge}/></button>
          <Link className={styles.actionButton} href="/team"><Icon name="user"/><span>Team Account</span></Link>
          <button className={styles.actionButton} type="button"><Icon name="logout"/><span>Logout</span></button>
        </nav>
      </header>

      <div className={styles.body}>
        <section className={styles.stats} aria-label="Team statistics">
          {statistics.map((stat) => <article className={`${styles.stat} ${styles[stat.color]}`} key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
        </section>

        <nav className={styles.tabs} aria-label="Dashboard sections">
          <button className={styles.activeTab} type="button">TEAM MEMBERS</button>
          <button type="button">LARGE PROJECTS</button>
          <button type="button">RECRUIT ENGINEERS</button>
        </nav>

        <section className={styles.teamSection}>
          <div className={styles.sectionHeader}>
            <h1>Your Engineering Team</h1>
            <button className={styles.addButton} type="button"><Icon name="addUser"/> ADD MEMBER</button>
          </div>
          <div className={styles.memberGrid}>
            {members.map((member) => (
              <article className={styles.memberCard} key={member.name}>
                <div className={styles.memberTop}>
                  <div><h2>{member.name}</h2><p>{member.role}</p></div>
                  <span className={member.status === "ACTIVE" ? styles.activeStatus : styles.leaveStatus}>{member.status}</span>
                </div>
                <div className={styles.memberBottom}>
                  <div className={styles.projectCount}><strong>{member.projects}</strong><span>Active Projects</span></div>
                  <button className={styles.manageButton} type="button">MANAGE</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
