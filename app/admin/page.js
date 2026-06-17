// app/admin/page.js
// The landing page of the private editor (route: /admin). For now it's a
// placeholder confirming access works. In Phase 3 this becomes the dashboard
// linking to the Character / Monster / Location editors backed by the database.

import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminHome() {
  return (
    <section>
      <h1 className={styles.h1}>Keeper&rsquo;s Desk</h1>
      <p>Welcome to the private editor. Choose what to work on:</p>

      <div className={styles.cards}>
        <Link href="/admin/characters" className={styles.adminCard}>
          <h2>Characters</h2>
          <p>People of the world — add, edit, remove.</p>
        </Link>
        <span className={`${styles.adminCard} ${styles.soon}`}>
          <h2>Monsters &amp; creatures</h2>
          <p>Coming next.</p>
        </span>
        <span className={`${styles.adminCard} ${styles.soon}`}>
          <h2>Locations</h2>
          <p>Coming next.</p>
        </span>
      </div>
    </section>
  );
}
