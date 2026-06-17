// lib/auth/client.js
// ---------------------------------------------------------------------------
// The BROWSER-SIDE auth client. Components in the browser use this to sign in,
// sign up, and sign out. It talks to our own /api/auth route (defined in
// app/api/auth/[...path]/route.js), so it needs NO URL and NO secret here —
// secrets stay on the server only.
// ---------------------------------------------------------------------------

"use client"; // marks everything in this file as browser ("client") code

import { createAuthClient } from "@neondatabase/auth/next";

export const authClient = createAuthClient();
