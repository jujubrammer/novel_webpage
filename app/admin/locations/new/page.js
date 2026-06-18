import { createLocation } from "../actions";
import LocationForm from "../LocationForm";
import styles from "../../admin.module.css";

export default function NewLocationPage() {
  return (
    <section>
      <h1 className={styles.h1}>New location</h1>
      <LocationForm action={createLocation} />
    </section>
  );
}
