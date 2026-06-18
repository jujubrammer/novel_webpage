import Link from "next/link";
import { sql } from "@/lib/db";
import { deleteLocation } from "./actions";
import DeleteButton from "../characters/DeleteButton";
import ImageLightbox from "../characters/ImageLightbox";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function LocationsListPage() {
  const locations = await sql`
    SELECT id, name, type, region, slug, image_url
    FROM locations
    ORDER BY name ASC
  `;

  return (
    <section>
      <div className={styles.listHead}>
        <h1 className={styles.h1}>Locations</h1>
        <Link href="/admin/locations/new" className={styles.save}>
          + New location
        </Link>
      </div>

      {locations.length === 0 ? (
        <p className={styles.empty}>
          No locations yet. Click <strong>New location</strong> to add the first one.
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Region</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td>
                  <span className={styles.nameCell}>
                    {loc.image_url ? (
                      <ImageLightbox src={loc.image_url} alt={loc.name} className={styles.listThumb} />
                    ) : (
                      <span className={styles.listThumbEmpty} aria-hidden="true" />
                    )}
                    {loc.name}
                  </span>
                </td>
                <td>{loc.type || "—"}</td>
                <td>{loc.region || "—"}</td>
                <td className={styles.rowActions}>
                  <Link href={`/admin/locations/${loc.id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                  <DeleteButton action={deleteLocation.bind(null, loc.id)} label={loc.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
