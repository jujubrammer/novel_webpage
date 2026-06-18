import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { updateLocation } from "../../actions";
import LocationForm from "../../LocationForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditLocationPage({ params }) {
  const { id } = await params;

  const rows = await sql`SELECT * FROM locations WHERE id = ${id} LIMIT 1`;
  const location = rows[0];
  if (!location) {
    notFound();
  }

  return (
    <section>
      <h1 className={styles.h1}>Edit: {location.name}</h1>
      <LocationForm action={updateLocation.bind(null, id)} location={location} />
    </section>
  );
}
