// app/api/migrate/route.js
// ---------------------------------------------------------------------------
// Applies the canonical schema (db/schema.sql) to the Neon database.
// All statements use IF NOT EXISTS, so re-running is safe and idempotent.
//
// Only signed-in admins may call this endpoint. Call it once after initial
// deployment (or after wiping the database) to create the tables.
// ---------------------------------------------------------------------------

import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await requireAdmin();

    await sql`
      CREATE TABLE IF NOT EXISTS characters (
        id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug          text UNIQUE NOT NULL,
        name          text NOT NULL,
        image_url     text,
        age           text,
        species       text,
        appearance    text,
        personality   text,
        abilities     text,
        relationships text,
        biography     text,
        notes         text,
        created_at    timestamptz NOT NULL DEFAULT now(),
        updated_at    timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS monsters (
        id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug           text UNIQUE NOT NULL,
        name           text NOT NULL,
        image_url      text,
        classification text,
        habitat        text,
        appearance     text,
        behavior       text,
        threat_level   text,
        weaknesses     text,
        lore           text,
        created_at     timestamptz NOT NULL DEFAULT now(),
        updated_at     timestamptz NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS locations (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug        text UNIQUE NOT NULL,
        name        text NOT NULL,
        image_url   text,
        type        text,
        region      text,
        description text,
        history     text,
        connections text,
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now()
      )
    `;

    return Response.json({ ok: true, message: "Schema applied." });
  } catch (error) {
    const message = error?.message || String(error);

    // requireAdmin() calls redirect() for unauthenticated users, which throws
    // a Next.js NEXT_REDIRECT error that must be re-thrown to work correctly.
    if (message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    const status = message.includes("Not authorized") ? 403 : 500;
    return Response.json({ error: message }, { status });
  }
}
