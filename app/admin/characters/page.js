// app/admin/characters/page.js
// The Characters list (route: /admin/characters). A server component that
// reads every character from the database and shows them in a table with
// Edit and Delete controls, plus a "New character" button.

import Link from "next/link";
import { sql } from "@/lib/db";
import { deleteCharacter } from "./actions";
import DeleteButton from "./DeleteButton";
import styles from "../admin.module.css";

// Always read fresh from the DB (don't cache this page).
export const dynamic = "force-dynamic";

export default async function CharactersListPage() {
  const characters = await sql`
    SELECT id, name, species, slug, image_url, updated_at
    FROM characters
    ORDER BY name ASC
  `;

  return (
    <section>
      <div className={styles.listHead}>
        <h1 className={styles.h1}>Characters</h1>
        <Link href="/admin/characters/new" className={styles.save}>
          + New character
        </Link>
      </div>

      {characters.length === 0 ? (
        <p className={styles.empty}>
          No characters yet. Click <strong>New character</strong> to add the first one.
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Slug</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {characters.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image_url} alt="" className={styles.listThumb} />
                  )}{" "}
                  {c.name}
                </td>
                <td>{c.species || "—"}</td>
                <td className={styles.mono}>{c.slug}</td>
                <td className={styles.rowActions}>
                  <Link href={`/admin/characters/${c.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                  {/* Bind the character's id to the delete action. */}
                  <DeleteButton action={deleteCharacter.bind(null, c.id)} label={c.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
