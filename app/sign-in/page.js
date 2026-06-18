// app/sign-in/page.js
// ---------------------------------------------------------------------------
// The sign-in / sign-up screen for the keeper (admin). This is a CLIENT
// component (note "use client" below) because it has interactive state — the
// form fields, the error message, and the submit handler all live in the
// browser.
//
// This is an internal tool, so the styling is intentionally plain. The point
// is to get a working login that unlocks the /admin editor.
// ---------------------------------------------------------------------------

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import styles from "./sign-in.module.css";

export default function SignInPage() {
  const router = useRouter();

  // `useState` gives a component a piece of memory. Each call returns the
  // current value and a function to change it; changing it re-renders the UI.
  const [mode, setMode] = useState("sign-in"); // "sign-in" or "sign-up"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's default full-page form submit
    setError("");
    setBusy(true);

    try {
      // Neon Auth's client methods return an object like { data, error }.
      // We handle BOTH styles defensively: an `error` field on the result,
      // OR a thrown exception, both end up in the catch/branch below.
      const result =
        mode === "sign-up"
          ? await authClient.signUp.email({ email, password, name })
          : await authClient.signIn.email({ email, password });

      if (result?.error) {
        throw new Error(result.error.message || "Authentication failed.");
      }

      // Hard navigation so the browser sends all fresh cookies and Next.js
      // can't serve a stale cached redirect from before the session existed.
      window.location.href = "/admin";
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // Sign in with Google. The auth client redirects the browser to Google and,
  // after consent, back to `callbackURL` (/admin). Because the page navigates
  // away on success, we only reset `busy` if something goes wrong.
  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/admin",
      });
      if (result?.error) {
        throw new Error(result.error.message || "Google sign-in failed.");
      }
      // On success the browser redirects to Google — nothing more to do here.
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <main className={styles.wrap}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Keeper&rsquo;s Sign-In</h1>
        <p className={styles.subtitle}>
          {mode === "sign-up"
            ? "Create the keeper account."
            : "Sign in to edit the archive."}
        </p>

        {/* Primary, recommended path: Google. No password to manage. */}
        <button
          type="button"
          className={styles.google}
          onClick={handleGoogle}
          disabled={busy}
        >
          Continue with Google
        </button>

        {/* A labelled divider between the Google option and the email form. */}
        <div className={styles.or} aria-hidden="true">
          <span>or use email</span>
        </div>

        {/* The name field only matters when creating an account. */}
        {mode === "sign-up" && (
          <label className={styles.field}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
        )}

        <label className={styles.field}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className={styles.field}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "sign-up" ? "new-password" : "current-password"
            }
            required
          />
        </label>

        {/* Show an error only if there is one. */}
        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={busy}>
          {busy
            ? "Working…"
            : mode === "sign-up"
              ? "Create account"
              : "Sign in"}
        </button>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => {
            setError("");
            setMode(mode === "sign-up" ? "sign-in" : "sign-up");
          }}
        >
          {mode === "sign-up"
            ? "Already have an account? Sign in"
            : "Need to create the keeper account? Sign up"}
        </button>
      </form>
    </main>
  );
}
