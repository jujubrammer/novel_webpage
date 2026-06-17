// lib/db.js
// ---------------------------------------------------------------------------
// Reusable database client. We use Neon's serverless driver, which runs SQL
// over HTTPS (port 443) — ideal for serverless/Vercel and for restricted
// networks. Import { sql } from here anywhere on the server to run queries:
//
//   import { sql } from "@/lib/db";
//   const rows = await sql`SELECT * FROM characters WHERE slug = ${slug}`;
//
// Values interpolated with ${...} are sent as PARAMETERS, not string-concatenated,
// so this is safe from SQL injection.
// ---------------------------------------------------------------------------

import { neon, neonConfig } from "@neondatabase/serverless";

// Neon's newer host format (…c-4.us-east-1.aws.neon.tech) isn't parsed correctly
// by the driver's default endpoint logic (it tried a bogus AWS host and failed
// DNS). Pin the SQL-over-HTTP endpoint explicitly so it always hits the right
// place: https://<host>/sql.
neonConfig.fetchEndpoint = (host) => `https://${host}/sql`;

// The HTTP SQL endpoint is served on the DIRECT (unpooled) host, so we read the
// unpooled connection string. Fail loudly if it's missing — no fallback.
const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  throw new Error(
    "Missing required environment variable DATABASE_URL_UNPOOLED. " +
      "Add the Neon DIRECT (unpooled) connection string to .env.local."
  );
}

export const sql = neon(connectionString);
