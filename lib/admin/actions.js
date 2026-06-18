// lib/admin/actions.js
// ---------------------------------------------------------------------------
// Shared server-action helpers for the admin CRUD modules.
// "use server" is NOT needed here — these are plain functions imported by
// the action files, which each declare "use server" themselves.
// ---------------------------------------------------------------------------

import { sql } from "@/lib/db";

// Read one form field. Returns null for empty fields so the database stores a
// clean NULL instead of an empty string.
export function field(formData, key) {
  const value = formData.get(key);
  if (value == null) return null;
  const text = value.toString().trim();
  return text === "" ? null : text;
}

// Build a slug-uniqueness query for the given table.
// table must be one of the three literal strings below — it is never user
// input. Neon's sql tagged template only parameterizes values, not
// identifiers, so we use a switch to emit safe literal table names.
function tableQuery(table, slug, ignoreId) {
  if (table === "characters") {
    return ignoreId
      ? sql`SELECT 1 FROM characters WHERE slug = ${slug} AND id <> ${ignoreId} LIMIT 1`
      : sql`SELECT 1 FROM characters WHERE slug = ${slug} LIMIT 1`;
  }
  if (table === "monsters") {
    return ignoreId
      ? sql`SELECT 1 FROM monsters WHERE slug = ${slug} AND id <> ${ignoreId} LIMIT 1`
      : sql`SELECT 1 FROM monsters WHERE slug = ${slug} LIMIT 1`;
  }
  if (table === "locations") {
    return ignoreId
      ? sql`SELECT 1 FROM locations WHERE slug = ${slug} AND id <> ${ignoreId} LIMIT 1`
      : sql`SELECT 1 FROM locations WHERE slug = ${slug} LIMIT 1`;
  }
  throw new Error(`Unknown table: ${table}`);
}

// Find a slug that isn't taken yet: "elara", then "elara-2", "elara-3", ...
// table must be a literal "characters" | "monsters" | "locations".
export async function uniqueSlug(table, base, ignoreId = null) {
  let slug = base;
  let n = 1;
  while (true) {
    const rows = await tableQuery(table, slug, ignoreId);
    if (rows.length === 0) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}
