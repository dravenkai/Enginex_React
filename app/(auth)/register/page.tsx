"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import loginStyles from "../login/login.module.css";
import styles from "./register.module.css";
import { Icon } from "../login/visuals";

type Role = "client" | "engineer";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<Role>("client");

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className={loginStyles.page}>
      <section className={loginStyles.left}>
        <div className={`${loginStyles.content} ${styles.content}`}>
          <Image className={loginStyles.logo} src="/enginex-logo.png" alt="Enginex logo" width={70} height={70} priority />
          <h1>Join ENGINEX</h1>

          <form onSubmit={register}>
            <label htmlFor="fullName">FULL NAME</label>
            <div className={styles.inputBox}>
              <Icon type="user" />
              <input id="fullName" name="fullName" type="text" placeholder="Enter Full Name" autoComplete="name" required />
            </div>

            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className={styles.inputBox}>
              <Icon type="mail" />
              <input id="email" name="email" type="email" placeholder="Enter Email Address" autoComplete="email" required />
            </div>

            <label htmlFor="phone">PHONE NUMBER</label>
            <div className={styles.inputBox}>
              <Icon type="phone" />
              <input id="phone" name="phone" type="tel" placeholder="Enter Phone Number" autoComplete="tel" required />
            </div>

            <label htmlFor="password">PASSWORD</label>
            <div className={styles.inputBox}>
              <Icon type="lock" />
              <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter Password" autoComplete="new-password" required />
              <button type="button" className={styles.eye} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                <Icon type="eye" />
              </button>
            </div>

            <label htmlFor="confirm">CONFIRM</label>
            <div className={styles.inputBox}>
              <Icon type="shieldCheck" />
              <input id="confirm" name="confirm" type={showConfirm ? "text" : "password"} placeholder="Confirm Password" autoComplete="new-password" required />
              <button type="button" className={styles.eye} onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Hide password" : "Show password"}>
                <Icon type="eye" />
              </button>
            </div>

            <div className={styles.roleGroup}>
              <label className={styles.roleLabel}>I AM A...</label>
              <div className={`${styles.roleRow} ${styles.roleClientBox}`}>
                <button
                  type="button"
                  aria-pressed={role === "client"}
                  onClick={() => setRole("client")}
                  className={`${styles.roleButton} ${role === "client" ? styles.roleActive : ""}`}
                >
                  Client
                </button>
                <button
                  type="button"
                  aria-pressed={role === "engineer"}
                  onClick={() => setRole("engineer")}
                  className={`${styles.roleButton} ${role === "engineer" ? styles.roleActive : ""}`}
                >
                  Engineer
                </button>
              </div>
              <input type="hidden" name="role" value={role} />
            </div>

            <button className={styles.submitButton} type="submit">
              CREATE ACCOUNT <Icon type="arrow" />
            </button>

            <div className={styles.or}><span>OR</span></div>

            <p className={styles.footer}>
              Already have an account? <Link href="/login">Log In</Link>
            </p>
          </form>
        </div>
      </section>

      <section className={loginStyles.art} aria-label="Enginex platform benefits">
        <div className={`${loginStyles.card} ${loginStyles.fast}`}>
          <div className={`${loginStyles.cardIcon} ${loginStyles.yellow}`}><Icon type="bolt" /></div>
          <div><h3>Fast Matching</h3><p>Connect instantly</p></div>
          <div className={loginStyles.fakeLines}><i/><i/><i/></div>
        </div>
        <div className={loginStyles.circle}/>
        <div className={loginStyles.speed}><i/><i/><i/></div>
        <div className={`${loginStyles.card} ${loginStyles.pros}`}>
          <div className={loginStyles.row}><div className={loginStyles.cardIcon}><Icon type="shield" /></div><div><h3>Verified Pros</h3><p>TU-Certified</p></div></div>
          <strong>1,247+</strong>
        </div>
        <div className={`${loginStyles.card} ${loginStyles.team}`}>
          <div className={`${loginStyles.cardIcon} ${loginStyles.blue}`}><Icon type="users" /></div>
          <div><h3>Team Power</h3><p>Collaborate easily</p></div>
          <div className={loginStyles.blocks}><i/><i/><i/><i/></div>
        </div>
        <div className={loginStyles.diamond}/>
      </section>
    </main>
  );
}
