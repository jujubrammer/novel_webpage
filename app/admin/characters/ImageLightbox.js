// app/admin/characters/ImageLightbox.js
// A small CLIENT component: shows an image as a thumbnail; clicking it opens a
// full-size overlay (lightbox). Click anywhere or press Escape to close. Reused
// by the form preview and the characters list. (The on-page thumbnail is small,
// but the stored image is full-resolution — this is how you see it fully.)

"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";

export default function ImageLightbox({ src, alt = "", className }) {
  const [open, setOpen] = useState(false);

  // Allow Escape to close while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!src) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={() => setOpen(true)}
        style={{ cursor: "zoom-in" }}
      />
      {open && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Image preview"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.lightboxImage} />
        </div>
      )}
    </>
  );
}
