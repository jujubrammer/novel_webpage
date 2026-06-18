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
import { field, uniqueSlug } from "@/lib/admin/actions";

export async function createCharacter(formData) {
  await requireAdmin(); // only a signed-in admin may create
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug("characters", slugify(name));

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

  const slug = await uniqueSlug("characters", slugify(name), id);

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
