// app/admin/layout.js
// ---------------------------------------------------------------------------
// This layout wraps EVERY page under /admin. It is a SERVER component, so it
// can safely read the session (this code never runs in the browser). It is the
// authorization gate for PAGE RENDERING:
//
//   * Not signed in        -> redirect to /sign-in
//   * Signed in, not admin -> show "Not authorized"
//   * Signed in admin      -> show the page
//
// (Database MUTATIONS are gated separately inside the server actions via
// requireAdmin(), because layouts do not wrap server actions.)
//
// `dynamic = "force-dynamic"` tells Next.js to render this fresh on every
// request (never cache it), which is required because it reads the session.
// ---------------------------------------------------------------------------

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admin";
import SignOutButton from "./SignOutButton";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  // getSession() returns { data, error }. When signed in, data.user.email holds
  // the current user's email.
  const { data } = await auth.getSession();
  const user = data?.user;

  // Not signed in → send to sign-in (this replaces what proxy.js used to do).
  if (!user) {
    redirect("/sign-in");
  }

  const isAdmin = isAdminEmail(user.email);

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
