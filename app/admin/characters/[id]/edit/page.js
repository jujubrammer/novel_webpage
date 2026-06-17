// app/admin/characters/[id]/edit/page.js
// The "edit a character" page (route: /admin/characters/<id>/edit). It loads the
// character from the database, then renders the shared form pre-filled, wired
// to updateCharacter (with this character's id bound in).
//
// Note: in Next.js 16, `params` is a Promise — we must `await` it to read the
// dynamic [id] segment from the URL.

import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { updateCharacter } from "../../actions";
import CharacterForm from "../../CharacterForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditCharacterPage({ params }) {
  const { id } = await params;

  const rows = await sql`SELECT * FROM characters WHERE id = ${id} LIMIT 1`;
  const character = rows[0];
  if (!character) {
    notFound(); // shows the 404 page if the id doesn't exist
  }

  return (
    <section>
      <h1 className={styles.h1}>Edit: {character.name}</h1>
      <CharacterForm action={updateCharacter.bind(null, id)} character={character} />
    </section>
  );
}
