"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/auth/admin";
import { field, uniqueSlug } from "@/lib/admin/actions";

export async function createLocation(formData) {
  await requireAdmin();
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug("locations", slugify(name));

  await sql`
    INSERT INTO locations
      (slug, name, type, region, description, history, connections, image_url)
    VALUES
      (${slug}, ${name}, ${field(formData, "type")}, ${field(formData, "region")},
       ${field(formData, "description")}, ${field(formData, "history")},
       ${field(formData, "connections")}, ${field(formData, "image_url")})
  `;

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function updateLocation(id, formData) {
  await requireAdmin();
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required.");

  const slug = await uniqueSlug("locations", slugify(name), id);

  await sql`
    UPDATE locations SET
      slug        = ${slug},
      name        = ${name},
      type        = ${field(formData, "type")},
      region      = ${field(formData, "region")},
      description = ${field(formData, "description")},
      history     = ${field(formData, "history")},
      connections = ${field(formData, "connections")},
      image_url   = ${field(formData, "image_url")},
      updated_at  = now()
    WHERE id = ${id}
  `;

  revalidatePath("/admin/locations");
  redirect("/admin/locations");
}

export async function deleteLocation(id) {
  await requireAdmin();
  await sql`DELETE FROM locations WHERE id = ${id}`;
  revalidatePath("/admin/locations");
}
