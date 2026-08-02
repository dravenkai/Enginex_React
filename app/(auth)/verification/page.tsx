"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./verification.module.css";

const steps = ["IDENTITY INFO", "DOCUMENT UPLOAD", "SELFIE CHECK"] as const;

function Icon({ type }: { type: "id" | "arrow" | "lock" | "clock" | "upload" | "camera" }) {
  const paths = {
    id: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6 16c1-3 5-3 6 0M15 9h3M15 13h3"/></>,
    arrow: <><path d="M5 12h14M14 6l6 6-6 6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 14v6h14v-6"/></>,
    camera: <><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="m8 6 2-3h4l2 3"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[type]}</svg>;
}

export default function VerificationPage() {
  const [step, setStep] = useState(0);

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep((current) => Math.min(current + 1, 2));
  }

  return <main className={styles.page}>
    <header className={styles.hero}>
      <span>ACCOUNT CREATED</span>
      <h1><b>Welcome to </b><strong>Enginex</strong></h1>
      <h2><b>Identity Verification</b></h2>
    </header>

    <ol className={styles.steps}>
      {steps.map((label, index) => <li className={index === step ? styles.active : index < step ? styles.done : ""} key={label}><button type="button" onClick={() => setStep(index)}><span>0{index + 1}</span><strong>{label}</strong></button></li>)}
    </ol>

    <section className={styles.panel}>
      {step === 0 && <form onSubmit={next}>
        <h3><Icon type="id"/> Step 01: Core Identity Data</h3>
        <div className={styles.fields}>
          <label>NRC NAME<input type="text" placeholder="Enter your NRC Name" required/></label>
          <label>NRC NUMBER / NATIONAL ID<input type="text" placeholder="00-000000-A-00" required/></label>
        </div>
        <button className={styles.next} type="submit">NEXT STAGE <Icon type="arrow"/></button>
      </form>}

      {step === 1 && <form onSubmit={next}>
        <h3><Icon type="upload"/> Step 02: Document Upload</h3>
        <label className={styles.dropZone}>UPLOAD NRC / NATIONAL ID<input type="file" accept="image/*,.pdf" required/><span>Choose a clear photo or PDF of your identity document.</span></label>
        <button className={styles.next} type="submit">NEXT STAGE <Icon type="arrow"/></button>
      </form>}

      {step === 2 && <div className={styles.selfie}>
        <h3><Icon type="camera"/> Step 03: Selfie Check</h3>
        <p>Take a clear selfie so we can match it with your identity document.</p>
        <button className={styles.next} type="button">START CAMERA <Icon type="camera"/></button>
      </div>}
    </section>

    <footer className={styles.notes}>
      <article><h3><Icon type="lock"/> ENCRYPTION PROTOCOL</h3><p>ALL DATA IS AES-256 ENCRYPTED AND COMPLIANT WITH GLOBAL ISO/IEC 27001 ENGINEERING SECURITY STANDARDS.</p></article>
      <article><h3><Icon type="clock"/> PROCESSING ESTIMATE</h3><p>MANUAL VERIFICATION QUEUE: 4–6 HOURS. AUTOMATED HASHING: 15 MINUTES POST-SUBMISSION.</p></article>
    </footer>
  </main>;
}
