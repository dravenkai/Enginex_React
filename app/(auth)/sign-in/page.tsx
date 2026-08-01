"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
  Zap,
} from "lucide-react";
import styles from "./page.module.css";

type Role = "Client" | "Engineer";

export default function SignInPage() {
  const [role, setRole] = useState<Role>("Client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.formPanel}>
        <div className={styles.formInner}>
          <Image className={styles.logo} src="/enginex-logo.png" alt="Enginex logo" width={72} height={72} priority />
          <h1>JOIN ENGINEX</h1>

          <form onSubmit={(event) => event.preventDefault()}>
            <Field label="FULL NAME" icon={<User size={17} />} name="name" type="text" placeholder="Enter Full Name" />
            <Field label="EMAIL ADDRESS" icon={<Mail size={18} />} name="email" type="email" placeholder="Enter Email Address" />
            <Field label="PHONE NUMBER" icon={<Phone size={18} />} name="phone" type="tel" placeholder="Enter Phone Number" />

            <PasswordField label="PASSWORD" name="password" visible={showPassword} onToggle={() => setShowPassword((value) => !value)} />
            <PasswordField label="CONFIRM" name="confirmPassword" visible={showConfirm} onToggle={() => setShowConfirm((value) => !value)} confirm />

            <fieldset className={styles.roleFieldset}>
              <legend>I AM A...</legend>
              <div className={styles.roleButtons}>
                {(["Client", "Engineer"] as Role[]).map((item) => (
                  <button key={item} type="button" className={role === item ? styles.roleActive : ""} onClick={() => setRole(item)} aria-pressed={role === item}>
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <button className={styles.submitButton} type="submit">CREATE ACCOUNT <ArrowRight size={19} /></button>
          </form>

          <div className={styles.divider}><span>OR</span></div>
          <p className={styles.loginPrompt}>Already have an account? <Link href="/login">Log In</Link></p>
        </div>
      </section>

      <aside className={styles.artPanel} aria-hidden="true">
        <div className={styles.fastCard}>
          <span className={styles.yellowIcon}><Zap size={27} /></span>
          <span><strong>Fast Matching</strong><small>Connect instantly</small></span>
          <i /><i /><i />
        </div>
        <div className={styles.yellowCircle} />
        <div className={styles.verifiedCard}>
          <div><span className={styles.whiteIcon}><ShieldCheck size={28} /></span><span><strong>Verified Pros</strong><small>TU-Certified</small></span></div>
          <b>1,247+</b>
        </div>
        <div className={styles.teamCard}>
          <div><span className={styles.blueIcon}><Users size={27} /></span><span><strong>Team Power</strong><small>Collaborate easily</small></span></div>
          <div className={styles.teamBars}><i /><i /><i /><i /></div>
        </div>
        <div className={styles.speedLines}><i /><i /><i /></div>
        <div className={styles.diamond} />
      </aside>
    </main>
  );
}

function Field({ label, icon, ...props }: { label: string; icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className={styles.field}><span>{label}</span><div>{icon}<input required {...props} /></div></label>;
}

function PasswordField({ label, name, visible, onToggle, confirm = false }: { label: string; name: string; visible: boolean; onToggle: () => void; confirm?: boolean }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div>
        {confirm ? <ShieldCheck size={18} /> : <LockKeyhole size={18} />}
        <input required name={name} type={visible ? "text" : "password"} placeholder="••••••••" minLength={8} />
        <button className={styles.eyeButton} type="button" onClick={onToggle} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}
