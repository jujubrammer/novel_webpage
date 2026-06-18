// lib/image-models.js
// The image-generation models we offer in the portrait dropdown. Each entry:
//   id    - Vercel AI Gateway model id
//   label - what shows in the menu
//   supportsReference - whether the model can take an input/reference image
//     (image-to-image editing). The gateway exposes no machine-readable flag for
//     this, so we set it from each model's documented capabilities.
// Shared by the PhotoUploader dropdown and the /api/generate-portrait route.

export const IMAGE_MODELS = [
  // --- Models that can use a reference image (image-to-image editing) ---
  { id: "openai/gpt-image-2", label: "OpenAI · GPT-Image-2 (best)", supportsReference: true },
  { id: "openai/gpt-image-1.5", label: "OpenAI · GPT-Image-1.5", supportsReference: true },
  { id: "openai/gpt-image-1", label: "OpenAI · GPT-Image-1", supportsReference: true },
  { id: "bfl/flux-2-pro", label: "Black Forest · FLUX 2 Pro", supportsReference: true },
  { id: "bytedance/seedream-4.5", label: "ByteDance · Seedream 4.5", supportsReference: true },

  // --- Text-to-image only (a reference image is ignored) ---
  { id: "google/imagen-4.0-ultra-generate-001", label: "Google · Imagen 4 Ultra", supportsReference: false },
  { id: "google/imagen-4.0-generate-001", label: "Google · Imagen 4", supportsReference: false },
  { id: "google/imagen-4.0-fast-generate-001", label: "Google · Imagen 4 Fast", supportsReference: false },
  { id: "bfl/flux-pro-1.1", label: "Black Forest · FLUX Pro 1.1", supportsReference: false },
  { id: "xai/grok-imagine-image", label: "xAI · Grok Imagine", supportsReference: false },
  { id: "recraft/recraft-v3", label: "Recraft · v3 (illustration)", supportsReference: false },
];

export const DEFAULT_IMAGE_MODEL = "openai/gpt-image-2";

export const IMAGE_MODEL_IDS = IMAGE_MODELS.map((m) => m.id);

export function modelSupportsReference(id) {
  const model = IMAGE_MODELS.find((m) => m.id === id);
  return !!(model && model.supportsReference);
}
