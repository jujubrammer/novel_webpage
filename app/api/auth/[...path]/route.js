// app/api/auth/[...path]/route.js
// ---------------------------------------------------------------------------
// This is a "catch-all" API route. The folder name `[...path]` means it
// matches ANY path under /api/auth (e.g. /api/auth/sign-in/email,
// /api/auth/get-session, /api/auth/sign-out). The Neon Auth SDK generates the
// GET and POST handlers for all of those for us — we just export them.
// ---------------------------------------------------------------------------

import { auth } from "@/lib/auth/server";

export const { GET, POST } = auth.handler();
