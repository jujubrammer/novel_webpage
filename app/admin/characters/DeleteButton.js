// app/admin/characters/DeleteButton.js
// A small CLIENT component so we can pop up a confirm() before deleting. The
// `action` prop is a server action (deleteCharacter already bound to an id);
// server actions can be passed from a server component to a client component
// like this. If the user cancels the confirm, we stop the form submit.

"use client";

import styles from "../admin.module.css";

export default function DeleteButton({ action, label }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete “${label}”? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={styles.delete}>
        Delete
      </button>
    </form>
  );
}
