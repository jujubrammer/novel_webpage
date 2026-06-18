import Link from "next/link";
import PhotoUploader from "../characters/PhotoUploader";
import styles from "../admin.module.css";

export default function MonsterForm({ action, monster }) {
  const m = monster || {};
  return (
    <form action={action} className={styles.form}>
      <label className={styles.label}>
        Name <span className={styles.req}>*</span>
        <input name="name" defaultValue={m.name || ""} required />
      </label>

      <div className={styles.row}>
        <label className={styles.label}>
          Classification
          <input name="classification" defaultValue={m.classification || ""} placeholder="e.g. Undead, Beast, Demon" />
        </label>
        <label className={styles.label}>
          Threat Level
          <input name="threat_level" defaultValue={m.threat_level || ""} placeholder="e.g. Low, High, Lethal" />
        </label>
      </div>

      <label className={styles.label}>
        Habitat
        <input name="habitat" defaultValue={m.habitat || ""} placeholder="e.g. Deep forests, Ancient ruins" />
      </label>

      <label className={styles.label}>
        Appearance
        <textarea name="appearance" rows={3} defaultValue={m.appearance || ""} />
      </label>

      <label className={styles.label}>
        Behavior
        <textarea name="behavior" rows={3} defaultValue={m.behavior || ""} />
      </label>

      <label className={styles.label}>
        Weaknesses
        <textarea name="weaknesses" rows={3} defaultValue={m.weaknesses || ""} />
      </label>

      <label className={styles.label}>
        Lore
        <textarea name="lore" rows={5} defaultValue={m.lore || ""} />
      </label>

      <div className={styles.portrait}>
        <span className={styles.portraitTitle}>Portrait</span>
        <PhotoUploader name="image_url" initialUrl={m.image_url || ""} entity="monsters" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.save}>
          Save monster
        </button>
        <Link href="/admin/monsters" className={styles.cancel}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
