// lib/auth/admin.js
// ---------------------------------------------------------------------------
// Shared admin-authorization helpers used by BOTH the /admin layout (to gate
// page rendering) and the server actions (to gate database mutations).
//
// Why both? In Next.js, a layout only protects what it RENDERS. A server action
// is a separate POST endpoint that a layout does NOT wrap — so every action
// must check authorization itself. These helpers keep that logic in one place.
// ---------------------------------------------------------------------------

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

// Parse the comma-separated allow-list. Missing env = configuration error (throw).
export function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) {
    throw new Error(
      "Missing required environment variable ADMIN_EMAILS. " +
        "Set it in .env.local to a comma-separated list of admin emails."
    );
  }
  return raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

// For server actions: ensure the caller is a signed-in admin, or stop them.
// Returns the user when allowed.
export async function requireAdmin() {
  const { data } = await auth.getSession();
  const user = data?.user;
  if (!user) {
    redirect("/sign-in"); // not signed in
  }
  if (!isAdminEmail(user.email)) {
    throw new Error("Not authorized: this account is not on the keeper's list.");
  }
  return user;
}
