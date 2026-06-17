// app/admin/characters/actions.js
// ---------------------------------------------------------------------------
// SERVER ACTIONS for characters. The "use server" line at the top marks every
// exported function here as code that runs ONLY on the server. We attach these
// directly to <form action={...}> — when the form submits, Next.js calls the
// function on the server with the submitted FormData. No API route or fetch by
// hand needed.
// ---------------------------------------------------------------------------

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth/admin";

// Read one form field. Returns null for empty fields so the database stores a
// clean NULL instead of an empty string. (Trimming user-typed form input is
// fine — this is not an environment variable.)
function field(formData, key) {
  const value = formData.get(key);
  if (value == null) return null;
  const text = value.toString().trim();
  return text === "" ? null : text;
}

// Find a slug that isn't taken yet: "elara", then "elara-2", "elara-3", ...
async function uniqueSlug(base, ignoreId = null) {
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = ignoreId
      ? await sql`SELECT 1 FROM characters WHERE slug = ${slug} AND id <> ${ignoreId} LIMIT 1`
      : await sql`SELECT 1 FROM characters WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createCharacter(formData) {
  await requireAdmin(); // only a signed-in admin may create
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug(slugify(name));

  await sql`
    INSERT INTO characters
      (slug, name, age, species, appearance, personality, abilities, relationships, biography, notes, image_url)
    VALUES
      (${slug}, ${name}, ${field(formData, "age")}, ${field(formData, "species")},
       ${field(formData, "appearance")}, ${field(formData, "personality")},
       ${field(formData, "abilities")}, ${field(formData, "relationships")},
       ${field(formData, "biography")}, ${field(formData, "notes")}, ${field(formData, "image_url")})
  `;

  revalidatePath("/admin/characters"); // refresh the list page's cached data
  redirect("/admin/characters");
}

export async function updateCharacter(id, formData) {
  await requireAdmin(); // only a signed-in admin may edit
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug(slugify(name), id);

  await sql`
    UPDATE characters SET
      slug          = ${slug},
      name          = ${name},
      age           = ${field(formData, "age")},
      species       = ${field(formData, "species")},
      appearance    = ${field(formData, "appearance")},
      personality   = ${field(formData, "personality")},
      abilities     = ${field(formData, "abilities")},
      relationships = ${field(formData, "relationships")},
      biography     = ${field(formData, "biography")},
      notes         = ${field(formData, "notes")},
      image_url     = ${field(formData, "image_url")},
      updated_at    = now()
    WHERE id = ${id}
  `;

  revalidatePath("/admin/characters");
  redirect("/admin/characters");
}

export async function deleteCharacter(id) {
  await requireAdmin(); // only a signed-in admin may delete
  await sql`DELETE FROM characters WHERE id = ${id}`;
  revalidatePath("/admin/characters");
}
