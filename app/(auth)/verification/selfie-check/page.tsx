"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./selfie-check.module.css";

function Icon({ name }: { name: "camera" | "gear" | "back" }) {
  const paths = {
    camera: <><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="m8 6 2-3h4l2 3"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
    back: <><path d="M20 12H5M10 6l-6 6 6 6"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function SelfieCheckPage() {
  const [captured, setCaptured] = useState(true);
  const [complete, setComplete] = useState(false);

  return <main className={styles.page}>
    <header className={styles.hero}><span>ACCOUNT CREATED</span><h1>Welcome to <strong>Enginex</strong></h1><h2>Identity Verification</h2></header>

    <ol className={styles.steps}>
      <li><Link href="/verification"><span>01</span><strong>IDENTITY INFO</strong></Link></li>
      <li><Link href="/verification/document-upload"><span>02</span><strong>DOCUMENT UPLOAD</strong></Link></li>
      <li><Link href="/verification/selfie-check"><span>03</span><strong>SELFIE CHECK</strong></Link></li>
    </ol>

    <div className={styles.workspace}>
      <section className={styles.biometric}>
        <h3>BIOMETRIC VERIFICATION</h3>
        <p>Position your face within the frame and<br/>ensure good lighting for optimal<br/>recognition.</p>
        <div className={`${styles.cameraFrame} ${captured ? styles.captured : ""}`}>
          <i/><i/><i/><i/><div className={styles.person}><span/><b/></div><div className={styles.faceGuide}/>
          {!captured && <strong>CAMERA READY</strong>}
        </div>
        <button className={styles.capture} type="button" onClick={() => setCaptured((value) => !value)}><Icon name="camera"/>{captured ? "CAPTURE AGAIN" : "CAPTURE SELFIE"}</button>
      </section>

      <aside className={styles.side}>
        <section className={styles.checklist}><h3>ⓘ CHECKLIST</h3><p>☑ Remove glasses or hats for<br/>clear visibility.</p><p>☑ Face the camera directly (no<br/>side profiles).</p><p>☑ Avoid busy backgrounds or<br/>direct sunlight.</p><p>☑ Ensure your full face is within<br/>the guide.</p></section>
        <section className={styles.note}><strong>SYSTEM NOTE:</strong><p>Verification is handled via<br/>localized AI processing. Images<br/>are encrypted end-to-end.</p></section>
        <div className={styles.controls}><Link href="/verification/document-upload"><Icon name="back"/> PREVIOUS</Link><button type="button" onClick={() => setComplete(true)}>{complete ? "VERIFICATION COMPLETE" : <>COMPLETE<br/>VERIFICATION</>}<Icon name="gear"/></button></div>
      </aside>
    </div>
  </main>;
}
