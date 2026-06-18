// lib/image-models.js
// The image-generation models we offer in the portrait dropdown. Each `id` is a
// Vercel AI Gateway model id; `label` is what shows in the menu. Shared by the
// PhotoUploader dropdown and the /api/generate-portrait route (which validates
// the chosen id against this list). To add/remove a model, edit this list.
//
// Note: image-to-image (using an uploaded image as a reference) works best with
// OpenAI's gpt-image models; other models may ignore the reference.

export const IMAGE_MODELS = [
  { id: "openai/gpt-image-2", label: "OpenAI · GPT-Image-2 (best, supports reference)" },
  { id: "openai/gpt-image-1.5", label: "OpenAI · GPT-Image-1.5" },
  { id: "openai/gpt-image-1", label: "OpenAI · GPT-Image-1" },
  { id: "google/imagen-4.0-ultra-generate-001", label: "Google · Imagen 4 Ultra" },
  { id: "google/imagen-4.0-generate-001", label: "Google · Imagen 4" },
  { id: "google/imagen-4.0-fast-generate-001", label: "Google · Imagen 4 Fast" },
  { id: "bfl/flux-2-pro", label: "Black Forest · FLUX 2 Pro" },
  { id: "bfl/flux-pro-1.1", label: "Black Forest · FLUX Pro 1.1" },
  { id: "bytedance/seedream-4.5", label: "ByteDance · Seedream 4.5" },
  { id: "xai/grok-imagine-image", label: "xAI · Grok Imagine" },
  { id: "recraft/recraft-v3", label: "Recraft · v3 (illustration)" },
];

export const DEFAULT_IMAGE_MODEL = "openai/gpt-image-2";

export const IMAGE_MODEL_IDS = IMAGE_MODELS.map((m) => m.id);
