import Link from "next/link";
import styles from "./profile.module.css";

type IconName = "grid" | "market" | "user" | "bell" | "settings" | "camera" | "proposal";
function Icon({ name }: { name: IconName }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    market: <><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M3 10c1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 3 5 0 1 3 4 3 5 0"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
    camera: <><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="m8 6 2-3h4l2 3"/></>,
    proposal: <><path d="m3 12 5-5 4 4 4-4 5 5-9 9-9-9Z"/><path d="m8 7 4-4 4 4"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

const proposals = [
  { name: "DEVIN ROSS", role: "Cloud Solutions Architect", message: '"I\'ve handled similar migrations for Fortune 500 firms. My approach centers…"', avatar: "blue" },
  { name: "SARAH CHEN", role: "Security Specialist", message: '"Expertise in hardening AWS environments. I can provide a full audit and remediation plan."', avatar: "gold" },
  { name: "ALEX RIVERA", role: "DevOps Engineer", message: '"Specialized in CI/CD pipeline automation. I propose a modular approach…"', avatar: "teal" },
] as const;

export default function ClientProfilePage() {
  return <main className={styles.page}>
    <aside className={styles.sidebar}>
      <div className={styles.logo}><strong>ENGINEX</strong><span>Client Suite</span></div>
      <nav><Link href="/client/dashboard"><Icon name="grid"/>DASHBOARD</Link><Link href="/client/marketplace"><Icon name="market"/>MARKETPLACE</Link><Link className={styles.active} href="/client/profile"><Icon name="user"/>PROFILE</Link></nav>
      <Link className={styles.newRequest} href="/client/dashboard/new-request">NEW REQUEST</Link>
    </aside>

    <section className={styles.main}>
      <header className={styles.header}><h1>ACCOUNT</h1><div><button aria-label="Notifications"><Icon name="bell"/></button><button aria-label="Settings"><Icon name="settings"/></button><span className={styles.miniAvatar}/></div></header>
      <div className={styles.content}>
        <section className={styles.profileRow}>
          <article className={styles.profileCard}>
            <Link href="#" className={styles.edit}>EDIT PROFILE</Link>
            <div className={styles.identity}>
              <div className={styles.portrait}><span/><b/><button aria-label="Change profile picture"><Icon name="camera"/></button></div>
              <div><h2>MARCUS<br/>THORNE</h2><p>▦ Horizon Systems Corp.</p><p>✉ m.thorne@horizonsystems.io</p><hr/><blockquote>Senior Infrastructure Director focused on scaling distributed cloud architectures. Dedicated to building reliable, high-performance systems for global enterprise operations.</blockquote></div>
            </div>
          </article>
          <article className={styles.projectStat}><span>ACTIVE PROJECTS</span><strong>12</strong><Link href="/client/my-projects">VIEW ALL PROJECTS</Link></article>
        </section>

        <div className={styles.proposalHeading}><h2><Icon name="proposal"/> SERVICE PROPOSALS</h2><span>3 NEW REQUESTS</span></div>
        <section className={styles.proposals}>
          {proposals.map((proposal) => <article className={styles.proposal} key={proposal.name}><div className={styles.proposalPerson}><span className={styles[proposal.avatar]}/><div><h3>{proposal.name}</h3><p>{proposal.role}</p></div></div><blockquote>{proposal.message}</blockquote><div><button>ACCEPT</button><button>DECLINE</button></div></article>)}
        </section>

        <section className={styles.security}><div><h2>ACCOUNT SECURITY</h2><p>Your profile is currently protected by Two-Factor Authentication. Keep your contact information updated to ensure project continuity.</p></div><div><button>SECURITY LOG</button><button>MANAGE KEYS</button></div></section>
      </div>
    </section>
  </main>;
}
