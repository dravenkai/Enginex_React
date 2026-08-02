import Link from "next/link";
import MarketplaceProfileNav from "../../_components/MarketplaceProfileNav";
import styles from "./engineer-profile.module.css";

const profiles = {
  "pai-min-thway-1": { name: "MARCUS CHEN", role: "STRUCTURAL SYSTEMS DESIGNER / LEAD ARCHITECT" },
  "chaint-chaint-chan-1": { name: "CHAINT CHAINT CHAN", role: "ARCHITECTURAL DESIGNER / PROJECT LEAD" },
} as const;

export default async function EngineerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug as keyof typeof profiles] ?? profiles["pai-min-thway-1"];

  return <MarketplaceProfileNav><main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.portrait}><span/><b/></div>
      <div className={styles.intro}><div className={styles.name}><h1>{profile.name}</h1><span>● VERIFIED ENGINEER</span></div><h2>{profile.role}</h2><div className={styles.metrics}><p><small>LOCATION</small>San Francisco, CA</p><p><small>EXPERIENCE</small>12+ Years</p><p><small>COMPLETED</small>48 Projects</p></div><div className={styles.heroActions}><button>REQUEST SERVICE</button><button aria-label="Add to favorites">♡</button></div></div>
    </section>

    <div className={styles.infoGrid}>
      <section className={styles.expertise}><h2>TECHNICAL EXPERTISE</h2><p>Marcus is a results-oriented Structural Engineer specializing in high-performance building systems and industrial infrastructure. With a decade of experience navigating complex urban regulatory environments and technical constraints, he delivers precision-engineered solutions that balance aesthetic vision with structural integrity.</p><p>His approach integrates advanced computational modeling with traditional engineering principles to optimize material usage and environmental sustainability. Marcus has led multidisciplinary teams on projects ranging from seismic retrofitting for historic landmarks to large-scale industrial HVAC integration.</p></section>
      <aside className={styles.specs}><section><h2>CORE SPECS</h2><small>PRIMARY FOCUS</small><strong>STRUCTURAL<br/>ENGINEERING</strong><small>TOOLS &amp; STACK</small><div><i>AUTOCAD</i><i>Revit</i><i>SAP2000</i><i>Bluebeam</i><i>Rhino3D</i></div><small>CERTIFICATIONS</small><ul className={styles.certifications}><li><span>✓</span>P.E. License #CA-99231</li><li><span>✓</span>LEED AP Building Design</li><li><span>✓</span>ASCE Senior Member</li></ul></section><section><h3>AVAILABILITY</h3><p>🟢 Taking new requests</p><hr/><p>Hourly Rate:<br/>Typical Response: <b>&lt; 4 Hours</b></p></section></aside>
    </div>

    <section className={styles.portfolio}><div><h2>PROJECT PORTFOLIO</h2><Link href="#">View Full Archive</Link></div><div className={styles.projects}><article><div className={`${styles.projectImage} ${styles.bridge}`}/><h3>BRIDGE STRUCTURAL<br/>ANALYSIS <span>2023</span></h3><p>Seismic load calculation and stress testing for the Northside Transit Link.</p><button>CASE STUDY</button></article><article><div className={`${styles.projectImage} ${styles.factory}`}/><h3>INDUSTRIAL HVAC<br/>DESIGN <span>2022</span></h3><p>Efficient thermodynamic routing for a 50,000 sq ft manufacturing plant.</p><button>CASE STUDY</button></article></div></section>
  </main></MarketplaceProfileNav>;
}
