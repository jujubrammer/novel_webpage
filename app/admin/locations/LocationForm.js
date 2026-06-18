import Link from "next/link";
import PhotoUploader from "../characters/PhotoUploader";
import styles from "../admin.module.css";

export default function LocationForm({ action, location }) {
  const l = location || {};
  return (
    <form action={action} className={styles.form}>
      <label className={styles.label}>
        Name <span className={styles.req}>*</span>
        <input name="name" defaultValue={l.name || ""} required />
      </label>

      <div className={styles.row}>
        <label className={styles.label}>
          Type
          <input name="type" defaultValue={l.type || ""} placeholder="e.g. City, Forest, Dungeon" />
        </label>
        <label className={styles.label}>
          Region
          <input name="region" defaultValue={l.region || ""} placeholder="e.g. Northern Reaches" />
        </label>
      </div>

      <label className={styles.label}>
        Description
        <textarea name="description" rows={3} defaultValue={l.description || ""} />
      </label>

      <label className={styles.label}>
        History
        <textarea name="history" rows={5} defaultValue={l.history || ""} />
      </label>

      <label className={styles.label}>
        Connections
        <textarea
          name="connections"
          rows={3}
          defaultValue={l.connections || ""}
          placeholder="Characters and creatures connected here"
        />
      </label>

      <div className={styles.portrait}>
        <span className={styles.portraitTitle}>Image</span>
        <PhotoUploader name="image_url" initialUrl={l.image_url || ""} entity="locations" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.save}>
          Save location
        </button>
        <Link href="/admin/locations" className={styles.cancel}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
