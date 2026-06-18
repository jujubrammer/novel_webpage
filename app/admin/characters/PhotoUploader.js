// app/admin/characters/PhotoUploader.js
// CLIENT component for the character photo. You can:
//   1. Pick the image model (dropdown — marks which ones can use a reference).
//   2. Upload an image — used as a REFERENCE so the AI keeps the character
//      consistent (only enabled for models that support image input).
//   3. Generate from the description fields (server writes the prompt, then the
//      image model renders it, editing the reference if one is supported+set).
// The resulting public URL is stored in a hidden `image_url` field.

"use client";

import { useState } from "react";
import {
  IMAGE_MODELS,
  DEFAULT_IMAGE_MODEL,
  modelSupportsReference,
} from "@/lib/image-models";
import ImageLightbox from "./ImageLightbox";
import styles from "../admin.module.css";

// Read a response safely: if the server returns a non-JSON error (a platform
// error page, a timeout, etc.), surface its actual text instead of a confusing
// "Unexpected token … is not valid JSON" from JSON.parse.
async function parseResponse(res) {
  const raw = await res.text();
  let body = {};
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      throw new Error(`Server error (${res.status}). ${raw.slice(0, 160)}`);
    }
  }
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status}).`);
  }
  return body;
}

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
  const [model, setModel] = useState(DEFAULT_IMAGE_MODEL);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(""); // transient "Uploading…/Generating…"
  const [note, setNote] = useState(""); // result note (e.g. reference used?)
  const [error, setError] = useState("");

  const refSupported = modelSupportsReference(model);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setNote("");
    setStatus("Uploading…");
    setBusy(true);
    try {
      // Server-side upload: send the file to our route, which stores it in Blob.
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/blob/upload", { method: "POST", body: form });
      const result = await parseResponse(res);
      setUrl(result.url);
    } catch (err) {
      setError(err?.message || "Upload failed.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  async function handleGenerate(event) {
    const form = event.currentTarget.form;
    const character = collectCharacter(form);
    if (!character.name && !character.appearance && !character.species) {
      setError("Fill in at least a name, species, or appearance first.");
      return;
    }
    setError("");
    setNote("");
    const willUseRef = !!url && refSupported;
    setStatus(
      willUseRef
        ? "Generating from the description + your reference… (~30s)"
        : "Generating from the description… (~30s)"
    );
    setBusy(true);
    try {
      const res = await fetch("/api/generate-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character, referenceUrl: url || null, model }),
      });
      const result = await parseResponse(res);
      setUrl(result.url);
      setNote(
        result.usedReference
          ? "✓ Used your reference image."
          : "Generated from the description only."
      );
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
        <ImageLightbox src={url} alt="Character portrait preview" className={styles.thumb} />
      ) : (
        <div className={styles.thumbEmpty}>No image yet</div>
      )}

      <div className={styles.uploaderControls}>
        <label className={styles.modelLabel}>
          Image model:
          <select
            className={styles.modelSelect}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={busy}
          >
            {IMAGE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
                {m.supportsReference ? " — reference ✓" : ""}
              </option>
            ))}
          </select>
        </label>

        <label
          className={`${styles.uploadHint}${refSupported ? "" : " " + styles.disabledHint}`}
        >
          {refSupported
            ? "Upload an image to use as a reference (keeps the character consistent):"
            : "Reference upload unavailable — this model generates from text only."}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={busy || !refSupported}
          />
        </label>

        <button
          type="button"
          className={styles.generate}
          onClick={handleGenerate}
          disabled={busy}
        >
          ✨ Generate from description
        </button>

        {url && !busy && refSupported && (
          <span className={styles.uploadHint}>
            Generating now will start from this image to keep the character consistent.
          </span>
        )}
        {status && <span className={styles.uploadHint}>{status}</span>}
        {note && <span className={styles.uploadHint}>{note}</span>}
        {error && <p className={styles.error}>{error}</p>}
        {url && !busy && (
          <button
            type="button"
            className={styles.removeImg}
            onClick={() => {
              setUrl("");
              setNote("");
            }}
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
