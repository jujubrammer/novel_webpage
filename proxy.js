// proxy.js  (project root)
// ---------------------------------------------------------------------------
// In Next.js 16, "Middleware" was renamed to "Proxy" — same feature, new name.
// This runs BEFORE a request reaches a matched page.
//
// auth.middleware() does two things:
//   1. Validates / refreshes the session token on every request.
//   2. Redirects unauthenticated visitors to loginUrl.
//
// Phase 3 removed this file because auth.middleware() was intercepting
// server-action POSTs to /admin and mishandling them. The fix is to pass
// those through directly — server actions authenticate themselves via
// requireAdmin() inside the action body.
// ---------------------------------------------------------------------------

import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

const neonProxy = auth.middleware({ loginUrl: "/sign-in" });

export default function proxy(req) {
  // Server actions are POST requests with a Next-Action header.
  // They self-authenticate via requireAdmin(), so skip the proxy check.
  if (req.headers.get("next-action")) {
    return NextResponse.next();
  }
  return neonProxy(req);
}

export const config = {
  matcher: ["/admin/:path*"],
};
