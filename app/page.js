// app/page.js
// ---------------------------------------------------------------------------
// This is the HOME PAGE. In Next.js's "App Router", a file named `page.js`
// inside a folder becomes a route. Because this file lives in the top-level
// `app/` folder, it is the site root: "/".
//
// Later (Phase 4) this page will grow a full navigation bar and featured
// sections for Characters, Monsters, and Locations. For now it's a calm
// placeholder so your first deploy to Vercel looks intentional, not empty.
// ---------------------------------------------------------------------------

import styles from "./page.module.css";

// A React component is just a function that returns the markup (JSX) to show.
// JSX looks like HTML but lives inside JavaScript. Note `className` instead of
// the HTML `class` — that's the one naming difference you'll meet most often.
export default function Home() {
  return (
    <main className={styles.hero}>
      <div className="container">
        {/* The "illuminated" eyebrow line above the title */}
        <p className={styles.kicker}>The World Archive of</p>

        <h1 className={styles.title}>If You Had Known</h1>

        <p className={styles.subtitle}>
          A keeper&rsquo;s record of the characters, creatures, places, and
          forgotten histories of the world.
        </p>

        {/* A decorative divider — a thin gilded rule with a diamond marker */}
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.diamond}>&#10022;</span>
        </div>

        <p className={styles.note}>
          The archive is being assembled. Soon these halls will hold the
          encyclopedias of <strong>characters</strong>,{" "}
          <strong>monsters</strong>, and <strong>locations</strong>, along with
          a map of the known world.
        </p>
      </div>
    </main>
  );
}
