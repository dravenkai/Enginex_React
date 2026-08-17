"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import loginStyles from "../login/login.module.css";
import { Icon } from "../login/visuals";
import { resendOtp, verifyEmail } from "@/lib/auth/api";
import { friendlyErrorMessage } from "@/lib/api/http";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp)) {
      setFormError("Enter the 6-digit code sent to your email.");
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmail({ email: email.trim(), otp });
      router.push("/login");
    } catch (error) {
      setFormError(friendlyErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setFormError("");
    setNotice("");
    if (!email.trim()) {
      setFormError("Enter your email address first.");
      return;
    }

    setResending(true);
    try {
      await resendOtp({ email: email.trim() });
      setNotice("A new code has been sent.");
    } catch (error) {
      setFormError(friendlyErrorMessage(error));
    } finally {
      setResending(false);
    }
  }

  return (
    <main className={loginStyles.page}>
      <section className={loginStyles.left}>
        <div className={loginStyles.content}>
          <h1>ENGINEX</h1>
          <h2>Verify Your Email</h2>
          <p className={loginStyles.subtitle}>
            Enter the 6-digit code we sent to your email address.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className={loginStyles.inputBox}>
              <Icon type="mail" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email Address"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <label htmlFor="otp">VERIFICATION CODE</label>
            <div className={loginStyles.inputBox}>
              <Icon type="shieldCheck" />
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              />
            </div>

            {formError && (
              <div className={loginStyles.error} role="alert">
                <span aria-hidden="true">!</span>
                {formError}
              </div>
            )}
            {notice && (
              <div className={loginStyles.error} role="status">
                {notice}
              </div>
            )}

            <button className={loginStyles.loginButton} type="submit" disabled={submitting}>
              {submitting ? "VERIFYING…" : "VERIFY EMAIL"} <Icon type="arrow" />
            </button>

            <button
              type="button"
              className={loginStyles.forgot}
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending…" : "Resend code"}
            </button>

            <div className={loginStyles.or}><span>OR</span></div>
            <Link className={loginStyles.registerButton} href="/login">BACK TO LOGIN</Link>
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
