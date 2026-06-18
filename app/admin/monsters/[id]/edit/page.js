import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { updateMonster } from "../../actions";
import MonsterForm from "../../MonsterForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditMonsterPage({ params }) {
  const { id } = await params;

  const rows = await sql`SELECT * FROM monsters WHERE id = ${id} LIMIT 1`;
  const monster = rows[0];
  if (!monster) {
    notFound();
  }

  return (
    <section>
      <h1 className={styles.h1}>Edit: {monster.name}</h1>
      <MonsterForm action={updateMonster.bind(null, id)} monster={monster} />
    </section>
  );
}
