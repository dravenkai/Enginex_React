"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, Logo } from "./visuals";
import styles from "./login.module.css";
import errorStyles from "./wrong-password.module.css";

export default function WrongPasswordLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <div className={styles.content}>
          <Logo />
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
              />
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
                aria-invalid="true"
                aria-describedby="password-error"
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

            <div id="password-error" className={errorStyles.error} role="alert">
              <span aria-hidden="true">!</span>
              Invalid password. Please try again.
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
