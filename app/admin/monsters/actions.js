"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth/admin";

function field(formData, key) {
  const value = formData.get(key);
  if (value == null) return null;
  const text = value.toString().trim();
  return text === "" ? null : text;
}

async function uniqueSlug(base, ignoreId = null) {
  let slug = base;
  let n = 1;

  while (true) {
    const rows = ignoreId
      ? await sql`SELECT 1 FROM monsters WHERE slug = ${slug} AND id <> ${ignoreId} LIMIT 1`
      : await sql`SELECT 1 FROM monsters WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createMonster(formData) {
  await requireAdmin();
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug(slugify(name));

  await sql`
    INSERT INTO monsters
      (slug, name, classification, habitat, appearance, behavior, threat_level, weaknesses, lore, image_url)
    VALUES
      (${slug}, ${name}, ${field(formData, "classification")}, ${field(formData, "habitat")},
       ${field(formData, "appearance")}, ${field(formData, "behavior")},
       ${field(formData, "threat_level")}, ${field(formData, "weaknesses")},
       ${field(formData, "lore")}, ${field(formData, "image_url")})
  `;

  revalidatePath("/admin/monsters");
  redirect("/admin/monsters");
}

export async function updateMonster(id, formData) {
  await requireAdmin();
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug(slugify(name), id);

  await sql`
    UPDATE monsters SET
      slug           = ${slug},
      name           = ${name},
      classification = ${field(formData, "classification")},
      habitat        = ${field(formData, "habitat")},
      appearance     = ${field(formData, "appearance")},
      behavior       = ${field(formData, "behavior")},
      threat_level   = ${field(formData, "threat_level")},
      weaknesses     = ${field(formData, "weaknesses")},
      lore           = ${field(formData, "lore")},
      image_url      = ${field(formData, "image_url")},
      updated_at     = now()
    WHERE id = ${id}
  `;

  revalidatePath("/admin/monsters");
  redirect("/admin/monsters");
}

export async function deleteMonster(id) {
  await requireAdmin();
  await sql`DELETE FROM monsters WHERE id = ${id}`;
  revalidatePath("/admin/monsters");
}
