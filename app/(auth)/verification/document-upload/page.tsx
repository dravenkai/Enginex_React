"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./document-upload.module.css";

function UploadIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M5 15v5h14v-5"/></svg>;
}

export default function DocumentUploadPage() {
  const [frontName, setFrontName] = useState("");
  const [backName, setBackName] = useState("");

  return <main className={styles.page}>
    <header className={styles.hero}>
      <span>ACCOUNT CREATED</span>
      <h1>Welcome to <strong>Enginex</strong></h1>
      <h2>Identity Verification</h2>
    </header>

    <ol className={styles.steps}>
      <li className={styles.complete}><Link href="/verification"><span>01</span><strong>IDENTITY INFO</strong></Link></li>
      <li className={styles.active}><Link href="/verification/document-upload"><span>02</span><strong>DOCUMENT UPLOAD</strong></Link></li>
      <li><Link href="/verification/selfie-check"><span>03</span><strong>SELFIE CHECK</strong></Link></li>
    </ol>

    <section className={styles.panel}>
      <h3>Identity Verification</h3>
      <p>Please upload high-resolution photos of your National Registration Card (NRC).</p>
      <div className={styles.uploads}>
        <label>NRC FRONT<span className={styles.drop}><UploadIcon/><strong>{frontName || "Click to Upload Front"}</strong><small>PDF, JPG, or PNG (Max 5MB)</small><input type="file" accept="image/png,image/jpeg,.pdf" onChange={(event) => setFrontName(event.target.files?.[0]?.name ?? "")}/></span></label>
        <label>NRC BACK<span className={styles.drop}><UploadIcon/><strong>{backName || "Click to Upload Back"}</strong><small>PDF, JPG, or PNG (Max 5MB)</small><input type="file" accept="image/png,image/jpeg,.pdf" onChange={(event) => setBackName(event.target.files?.[0]?.name ?? "")}/></span></label>
      </div>
      <div className={styles.notice}><span>i</span>Ensure all details are legible and the document is not expired.</div>
    </section>

    <footer className={styles.footer}>
      <article><h3>Upload Standards</h3><p><b>×</b> No glare or reflections on text</p><p><b>×</b> No cropped edges or corners</p><p><i>✓</i> Color images only (No B&amp;W)</p></article>
      <article className={styles.help}><h3>Need Help?</h3><p>Our support engineering team is<br/>available 24/7 to assist with<br/>verification issues.</p><a href="mailto:support@enginex.example">CONTACT SUPPORT CLUSTER</a></article>
    </footer>
  </main>;
}
