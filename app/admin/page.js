// app/admin/page.js
// The landing page of the private editor (route: /admin). For now it's a
// placeholder confirming access works. In Phase 3 this becomes the dashboard
// linking to the Character / Monster / Location editors backed by the database.

import styles from "./admin.module.css";

export default function AdminHome() {
  return (
    <section>
      <h1 className={styles.h1}>Keeper&rsquo;s Desk</h1>
      <p>
        Welcome to the private editor. Access is working. From here you&rsquo;ll
        soon be able to create and edit:
      </p>
      <ul className={styles.list}>
        <li>Characters</li>
        <li>Monsters &amp; creatures</li>
        <li>Locations</li>
      </ul>
      <p className={styles.todo}>
        Next (Phase 3): connect the database and build these editing forms.
      </p>
    </section>
  );
}
