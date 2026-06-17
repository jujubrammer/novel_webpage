// lib/auth/server.js
// ---------------------------------------------------------------------------
// The SERVER-SIDE auth instance. This is the single source of truth for
// authentication on the server: the API route, the proxy (middleware), and any
// server component / server action all import `auth` from here.
//
// We read configuration straight from environment variables and FAIL LOUDLY if
// anything is missing — no fallback names, no trimming, no guessing. A missing
// or wrong variable should crash with a clear message, not silently misbehave.
// ---------------------------------------------------------------------------

import { createNeonAuth } from "@neondatabase/auth/next/server";

// The Neon Auth base URL (from Neon Console → Auth → Configuration).
const baseUrl = process.env.NEON_AUTH_BASE_URL;
if (!baseUrl) {
  throw new Error(
    "Missing required environment variable NEON_AUTH_BASE_URL. " +
      "Copy it from the Neon Console (Auth → Configuration → Next.js) into .env.local."
  );
}

// The secret used to sign session cookies (>= 32 chars). Generate with:
//   openssl rand -base64 32
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error(
    "Missing required environment variable NEON_AUTH_COOKIE_SECRET. " +
      "Generate one with: openssl rand -base64 32, then put it in .env.local."
  );
}

// `auth` exposes: .handler() (for the API route), .middleware() (for proxy.js),
// .getSession(), .signIn.email(), .signUp.email(), .signOut(), etc.
export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
    // The SDK now defaults the session cookie to SameSite=Strict. That breaks
    // social (Google) sign-in: when the browser is redirected BACK from Google
    // to /admin, the browser treats it as a cross-site navigation and a Strict
    // cookie is withheld — so the first attempt lands on /sign-in, and only a
    // second (now same-site) visit works. "lax" sends the cookie on top-level
    // cross-site navigations (the OAuth return) while still blocking it on
    // cross-site subrequests — the standard, safe setting for auth cookies.
    sameSite: "lax",
  },
});
