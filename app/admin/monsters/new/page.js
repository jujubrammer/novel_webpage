import { createMonster } from "../actions";
import MonsterForm from "../MonsterForm";
import styles from "../../admin.module.css";

export default function NewMonsterPage() {
  return (
    <section>
      <h1 className={styles.h1}>New monster</h1>
      <MonsterForm action={createMonster} />
    </section>
  );
}
