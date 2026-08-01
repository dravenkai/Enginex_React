"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, KeyRound, LockKeyhole, Mail, RotateCcw, Send } from "lucide-react";
import styles from "./reset.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setError(true);
      return;
    }

    router.push(`/forgot-password/check-ur-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <header className={styles.brand}>
            <Image className={styles.logo} src="/enginex-logo.png" alt="Enginex logo" width={70} height={70} priority />
            <h1>ENGINEX</h1>
            <h2>Password Reset</h2>
            <p>Enter your email to receive reset instructions.</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <label className={styles.label} htmlFor="email">EMAIL ADDRESS</label>
            <div className={`${styles.inputWrap} ${error ? styles.inputError : ""}`}>
              <Mail size={19} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(false); }}
                placeholder="your.email@example.com"
                autoComplete="email"
                aria-describedby={error ? "email-error" : undefined}
                aria-invalid={error}
              />
            </div>

            {error && (
              <p className={styles.errorMessage} id="email-error" role="alert">
                <AlertCircle size={17} /> Email address not found in our system
              </p>
            )}

            <button className={styles.submitButton} type="submit">
              <Send size={21} /> SEND RESET LINK
            </button>
          </form>

          <div className={styles.divider}><span>OR</span></div>
          <Link className={styles.backButton} href="/login">← BACK TO LOGIN</Link>
        </div>
      </section>

      <aside className={styles.artPanel} aria-hidden="true">
        <div className={styles.quickCard}>
          <span className={styles.blueIcon}><RotateCcw size={27} /></span>
          <span><strong>Quick Reset</strong><small>Secure &amp; instant</small></span>
          <i /><i /><i />
        </div>
        <div className={styles.greenKey}><KeyRound size={29} /></div>
        <div className={styles.passwordCard}>
          <span className={styles.lockCircle}><LockKeyhole size={31} /></span>
          <span className={styles.passwordDots}>••••••••••••</span>
          <strong>FORGOT PASSWORD?</strong>
        </div>
        <div className={styles.mailCard}><Mail size={34} /></div>
        <div className={styles.speedLines}><i /><i /><i /></div>
      </aside>
    </main>
  );
}
