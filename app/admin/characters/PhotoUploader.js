// app/admin/characters/PhotoUploader.js
// A CLIENT component for setting a character photo. Two ways:
//   1. Upload a file from your device (direct to Vercel Blob).
//   2. Generate one with AI from the character's description (the other form
//      fields). If an image is already set (uploaded or previously generated),
//      it's sent along as a REFERENCE so the new portrait keeps the same
//      character — so you can upload a base image, then refine with the text.
// The resulting public URL is stored in a hidden field named `image_url`, which
// the server action saves. This sits at the bottom of the form so the
// description fields are filled in before you generate from them.

"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import styles from "../admin.module.css";

// Collect the description fields the image prompt is built from (on the server).
function collectCharacter(form) {
  const f = (n) => (form?.elements?.namedItem(n)?.value || "").trim();
  return {
    name: f("name"),
    age: f("age"),
    species: f("species"),
    appearance: f("appearance"),
    personality: f("personality"),
    abilities: f("abilities"),
  };
}

export default function PhotoUploader({ name = "image_url", initialUrl = "" }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setStatus("Uploading…");
    setBusy(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });
      setUrl(blob.url);
    } catch (err) {
      setError(err?.message || "Upload failed.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  async function handleGenerate(event) {
    const form = event.currentTarget.form; // the enclosing <form>
    const character = collectCharacter(form);
    if (!character.name && !character.appearance && !character.species) {
      setError("Fill in at least a name, species, or appearance first.");
      return;
    }
    setError("");
    setStatus(
      url
        ? "Generating from the description + your image… (~30s)"
        : "Generating from the description… (~30s)"
    );
    setBusy(true);
    try {
      const res = await fetch("/api/generate-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the raw fields; the server writes the prompt (pass 1) then draws
        // it (pass 2), using the current image as a reference if present.
        body: JSON.stringify({ character, referenceUrl: url || null }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Generation failed.");
      setUrl(result.url);
    } catch (err) {
      setError(err?.message || "Generation failed.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  return (
    <div className={styles.uploader}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Character portrait preview" className={styles.thumb} />
      ) : (
        <div className={styles.thumbEmpty}>No image</div>
      )}

      <div className={styles.uploaderControls}>
        <label className={styles.uploadHint}>
          Upload an image (also used as a starting point if you generate):
          <input type="file" accept="image/*" onChange={handleFile} disabled={busy} />
        </label>

        <button
          type="button"
          className={styles.generate}
          onClick={handleGenerate}
          disabled={busy}
        >
          ✨ Generate from description
        </button>

        {url && !busy && (
          <span className={styles.uploadHint}>
            Generating now will start from this image to keep the character consistent.
          </span>
        )}
        {status && <span className={styles.uploadHint}>{status}</span>}
        {error && <p className={styles.error}>{error}</p>}
        {url && !busy && (
          <button
            type="button"
            className={styles.removeImg}
            onClick={() => setUrl("")}
          >
            Remove image
          </button>
        )}
      </div>

      {/* This hidden field is what the server action reads on submit. */}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
