// app/admin/characters/CharacterForm.js
// A reusable form used by BOTH the "new" and "edit" pages. It's a server
// component — just markup. The `action` prop is a server action (create or
// update), and `character` (optional) pre-fills the fields when editing.
//
// We use `defaultValue` (not `value`) so these are simple, uncontrolled inputs:
// the browser manages what you type, and the values are read from FormData on
// submit. No client-side state needed.

import Link from "next/link";
import PhotoUploader from "./PhotoUploader";
import styles from "../admin.module.css";

export default function CharacterForm({ action, character }) {
  const c = character || {};
  return (
    <form action={action} className={styles.form}>
      <label className={styles.label}>
        Name <span className={styles.req}>*</span>
        <input name="name" defaultValue={c.name || ""} required />
      </label>

      <div className={styles.label}>
        Portrait
        <PhotoUploader name="image_url" initialUrl={c.image_url || ""} />
      </div>

      <div className={styles.row}>
        <label className={styles.label}>
          Age
          <input name="age" defaultValue={c.age || ""} placeholder="e.g. 24, or “Ancient”" />
        </label>
        <label className={styles.label}>
          Species / race
          <input name="species" defaultValue={c.species || ""} />
        </label>
      </div>

      <label className={styles.label}>
        Appearance
        <textarea name="appearance" rows={3} defaultValue={c.appearance || ""} />
      </label>

      <label className={styles.label}>
        Personality
        <textarea name="personality" rows={3} defaultValue={c.personality || ""} />
      </label>

      <label className={styles.label}>
        Abilities / powers
        <textarea name="abilities" rows={3} defaultValue={c.abilities || ""} />
      </label>

      <label className={styles.label}>
        Relationships
        <textarea name="relationships" rows={3} defaultValue={c.relationships || ""} />
      </label>

      <label className={styles.label}>
        Biography
        <textarea name="biography" rows={5} defaultValue={c.biography || ""} />
      </label>

      <label className={styles.label}>
        Important notes
        <textarea name="notes" rows={3} defaultValue={c.notes || ""} />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.save}>
          Save character
        </button>
        <Link href="/admin/characters" className={styles.cancel}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
