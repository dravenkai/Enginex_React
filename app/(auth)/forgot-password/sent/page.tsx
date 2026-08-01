import Image from "next/image";
import Link from "next/link";
import { Check, KeyRound, LockKeyhole, Mail } from "lucide-react";
import styles from "../page.module.css";

export default async function EmailSentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "client@gmail.com";

  return (
    <main className={styles.page}>
      <section className={styles.content}><div className={styles.contentInner}>
        <header className={styles.brand}>
          <Image className={styles.logo} src="/enginex-logo.png" alt="Enginex logo" width={62} height={62} priority />
          <p className={styles.brandName}>ENGINEX</p>
        </header>
        <div className={styles.card}>
          <div className={styles.successBadge} aria-hidden="true"><Check size={34} strokeWidth={3.2} /></div>
          <h1 className={styles.title}>Check Your Email!</h1>
          <p className={styles.subtitle}>Reset link sent to:</p>
          <output className={styles.email}>{email}</output>
          <ul className={styles.instructions}>
            <li>📧 Check your inbox and spam folder</li><li>⏰ Link expires in 24 hours</li><li>🔒 Click the link to create a new password</li>
          </ul>
          <Link className={styles.loginButton} href="/login">← BACK TO LOGIN</Link>
          <Link className={styles.tryAgain} href="/forgot-password">Didn&apos;t receive? Try a different email</Link>
        </div>
      </div></section>
      <aside className={styles.artPanel} aria-hidden="true">
        <div className={styles.notice}><span className={styles.iconTile}><Mail size={24} /></span><span><p className={styles.artTitle}>Email Sent</p><p className={styles.artText}>Delivery confirmed</p></span></div>
        <div className={styles.lock}><LockKeyhole size={31} /></div>
        <div className={styles.keyCard}><span className={styles.iconTile}><KeyRound size={24} /></span><span><p className={styles.artTitle}>Reset Key</p><p className={styles.artText}>Valid for 24h</p></span></div>
        <div className={styles.blueCircle} />
      </aside>
    </main>
  );
}
