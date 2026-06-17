// app/admin/characters/new/page.js
// The "create a character" page (route: /admin/characters/new). It renders the
// shared form with the createCharacter server action.

import { createCharacter } from "../actions";
import CharacterForm from "../CharacterForm";
import styles from "../../admin.module.css";

export default function NewCharacterPage() {
  return (
    <section>
      <h1 className={styles.h1}>New character</h1>
      <CharacterForm action={createCharacter} />
    </section>
  );
}
