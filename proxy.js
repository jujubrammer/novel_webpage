// proxy.js  (project root)
// ---------------------------------------------------------------------------
// In Next.js 16, "Middleware" was renamed to "Proxy" — same feature, new name.
// Code here runs BEFORE a request reaches a matched page. We use it as an
// OPTIMISTIC gate: if someone tries to open /admin without being signed in,
// the Neon Auth middleware redirects them to /sign-in.
//
// IMPORTANT: this only checks that a visitor is LOGGED IN. It does NOT decide
// whether they are an allowed admin — Next.js recommends keeping real
// authorization in the page/layout. We do the email allow-list check in
// app/admin/layout.js. Treat this proxy as a first, fast line of defense only.
// ---------------------------------------------------------------------------

import { auth } from "@/lib/auth/server";

// Redirect unauthenticated visitors of matched routes to the sign-in page.
export default auth.middleware({ loginUrl: "/sign-in" });

export const config = {
  // Only run this proxy on /admin and everything beneath it.
  matcher: ["/admin/:path*"],
};
