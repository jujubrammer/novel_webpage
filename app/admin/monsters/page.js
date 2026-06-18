import Link from "next/link";
import { sql } from "@/lib/db";
import { deleteMonster } from "./actions";
import DeleteButton from "../characters/DeleteButton";
import ImageLightbox from "../characters/ImageLightbox";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function MonstersListPage() {
  const monsters = await sql`
    SELECT id, name, classification, threat_level, slug, image_url
    FROM monsters
    ORDER BY name ASC
  `;

  return (
    <section>
      <div className={styles.listHead}>
        <h1 className={styles.h1}>Monsters &amp; Creatures</h1>
        <Link href="/admin/monsters/new" className={styles.save}>
          + New monster
        </Link>
      </div>

      {monsters.length === 0 ? (
        <p className={styles.empty}>
          No monsters yet. Click <strong>New monster</strong> to add the first one.
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Classification</th>
              <th>Threat Level</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {monsters.map((m) => (
              <tr key={m.id}>
                <td>
                  <span className={styles.nameCell}>
                    {m.image_url ? (
                      <ImageLightbox src={m.image_url} alt={m.name} className={styles.listThumb} />
                    ) : (
                      <span className={styles.listThumbEmpty} aria-hidden="true" />
                    )}
                    {m.name}
                  </span>
                </td>
                <td>{m.classification || "—"}</td>
                <td>{m.threat_level || "—"}</td>
                <td className={styles.rowActions}>
                  <Link href={`/admin/monsters/${m.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                  <DeleteButton action={deleteMonster.bind(null, m.id)} label={m.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
