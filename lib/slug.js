// lib/slug.js
// Turns a name like "Elara Windwright" into a URL-friendly slug
// "elara-windwright" used in the address bar for that entry's public page.

export function slugify(input) {
  return (
    String(input)
      .toLowerCase()
      .normalize("NFKD") // split accented letters so we can drop the accents
      .replace(/[^a-z0-9]+/g, "-") // anything not a-z/0-9 becomes a dash
      .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
      .slice(0, 80) || "entry" // never return an empty slug
  );
}
