// app/admin/characters/PhotoUploader.js
// A CLIENT component for setting a character photo two ways:
//   1. Upload a file from your device (direct to Vercel Blob).
//   2. Generate one with AI from the character's description.
// Either way, the resulting public URL is stored in a hidden form field named
// `image_url`, which the server action saves. The server never handles the raw
// file/bytes for uploads (the browser talks to Blob directly).

"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import styles from "../admin.module.css";

// Build an image prompt from whatever the keeper has typed in the form so far.
function buildPrompt(form) {
  const get = (n) => (form?.elements?.namedItem(n)?.value || "").trim();
  const name = get("name");
  const species = get("species");
  const appearance = get("appearance");
  const personality = get("personality");

  const parts = [];
  parts.push("Fantasy character portrait" + (name ? ` of ${name}` : ""));
  if (species) parts.push(`a ${species}`);
  if (appearance) parts.push(appearance);
  if (personality) parts.push(`personality: ${personality}`);
  parts.push(
    "head-and-shoulders, detailed painted illustration, fantasy encyclopedia art style, muted parchment tones"
  );
  return parts.join(". ");
}

export default function PhotoUploader({ name = "image_url", initialUrl = "" }) {
  const [url, setUrl] = useState(initialUrl || "");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(""); // small "Uploading…/Generating…" note
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
    // A button inside a <form> exposes the form via `.form`.
    const form = event.currentTarget.form;
    const prompt = buildPrompt(form);
    setError("");
    setStatus("Generating… (this can take ~20s)");
    setBusy(true);
    try {
      const res = await fetch("/api/generate-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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
        <input type="file" accept="image/*" onChange={handleFile} disabled={busy} />

        <button
          type="button"
          className={styles.generate}
          onClick={handleGenerate}
          disabled={busy}
        >
          ✨ Generate with AI
        </button>

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
