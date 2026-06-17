// app/admin/layout.js
// ---------------------------------------------------------------------------
// This layout wraps EVERY page under /admin. It is a SERVER component, so it
// can safely read the session and secret env vars (this code never runs in the
// browser). It is the real authorization gate:
//
//   1. proxy.js already bounced anyone who isn't logged in.
//   2. Here we additionally require the logged-in user's email to be on the
//      ADMIN_EMAILS allow-list. Logged in but not an admin → "Not authorized".
//
// `dynamic = "force-dynamic"` tells Next.js to render this fresh on every
// request (never cache it), which is required because it reads the session.
// ---------------------------------------------------------------------------

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import SignOutButton from "./SignOutButton";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

// Read the allow-list from the environment. We split the comma-separated list
// into individual emails. We do NOT silently fall back if it's missing — a
// missing ADMIN_EMAILS is a configuration error and should throw.
function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) {
    throw new Error(
      "Missing required environment variable ADMIN_EMAILS. " +
        "Set it in .env.local to a comma-separated list of admin emails " +
        "(e.g. ADMIN_EMAILS=juliana@example.com)."
    );
  }
  // Splitting a comma list and normalizing case is list-parsing, not masking a
  // wrong value: an email that doesn't match simply gets denied access.
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export default async function AdminLayout({ children }) {
  // getSession() returns { data, error }. When signed in, data.user.email holds
  // the current user's email.
  const { data } = await auth.getSession();
  const user = data?.user;

  // Defense in depth: if somehow there's no session here, send to sign-in.
  if (!user) {
    redirect("/sign-in");
  }

  const adminEmails = getAdminEmails();
  const isAdmin = adminEmails.includes(user.email.toLowerCase());

  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <span className={styles.brand}>
          If You Had Known — Keeper&rsquo;s Desk
        </span>
        <span className={styles.who}>
          {user.email}
          <SignOutButton />
        </span>
      </header>

      <main className={styles.body}>
        {isAdmin ? (
          children
        ) : (
          <div className={styles.denied}>
            <h1>Not authorized</h1>
            <p>
              You&rsquo;re signed in as <strong>{user.email}</strong>, but this
              account isn&rsquo;t on the keeper&rsquo;s list. Add this email to{" "}
              <code>ADMIN_EMAILS</code> in <code>.env.local</code> to grant
              access.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
