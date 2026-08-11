"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "../login/visuals";
import styles from "../login/login.module.css";
import errorStyles from "./wrong-email.module.css";

export default function WrongEmailLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <div className={styles.content}>
          <Image className={styles.logo} src="/enginex-logo.png" alt="Enginex logo" width={70} height={70} priority />
          <h1>ENGINEX</h1>
          <h2>Welcome Back!</h2>
          <p className={styles.subtitle}>Log in to access your engineering hub.</p>

          <form onSubmit={(event) => event.preventDefault()} noValidate>
            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className={styles.inputBox}>
              <Icon type="mail" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email Address"
                autoComplete="email"
                aria-invalid="true"
                aria-describedby="email-error"
              />
            </div>

            <div id="email-error" className={errorStyles.error} role="alert">
              <span aria-hidden="true">!</span>
              Invalid email. Please try again.
            </div>

            <label htmlFor="password">PASSWORD</label>
            <div className={styles.inputBox}>
              <Icon type="lock" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon type="eye" />
              </button>
            </div>

            <Link className={styles.forgot} href="/forgot-password">Forgot password?</Link>
            <button className={styles.loginButton} type="submit">ENTER HUB <Icon type="arrow" /></button>
            <div className={styles.or}><span>OR</span></div>
            <Link className={styles.registerButton} href="/register">CREATE NEW ACCOUNT</Link>
          </form>
        </div>
      </section>

      <section className={styles.art} aria-label="Enginex platform benefits">
        <div className={`${styles.card} ${styles.fast}`}>
          <div className={`${styles.cardIcon} ${styles.yellow}`}><Icon type="bolt" /></div>
          <div><h3>Fast Matching</h3><p>Connect instantly</p></div>
          <div className={styles.fakeLines}><i/><i/><i/></div>
        </div>
        <div className={styles.circle}/>
        <div className={styles.speed}><i/><i/><i/></div>
        <div className={`${styles.card} ${styles.pros}`}>
          <div className={styles.row}>
            <div className={styles.cardIcon}><Icon type="shield" /></div>
            <div><h3>Verified Pros</h3><p>TU-Certified</p></div>
          </div>
          <strong>1,247+</strong>
        </div>
        <div className={`${styles.card} ${styles.team}`}>
          <div className={`${styles.cardIcon} ${styles.blue}`}><Icon type="users" /></div>
          <div><h3>Team Power</h3><p>Collaborate easily</p></div>
          <div className={styles.blocks}><i/><i/><i/><i/></div>
        </div>
        <div className={styles.diamond}/>
      </section>
    </main>
  );
}
