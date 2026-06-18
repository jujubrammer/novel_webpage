// app/admin/page.js
// The landing page of the private editor (route: /admin).

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
        <Link href="/admin/monsters" className={styles.adminCard}>
          <h2>Monsters &amp; creatures</h2>
          <p>Beasts, demons, and things that lurk — add, edit, remove.</p>
        </Link>
        <Link href="/admin/locations" className={styles.adminCard}>
          <h2>Locations</h2>
          <p>Cities, ruins, wilds — add, edit, remove.</p>
        </Link>
      </div>
    </section>
  );
}
