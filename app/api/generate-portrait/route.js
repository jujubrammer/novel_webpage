// app/api/generate-portrait/route.js
// ---------------------------------------------------------------------------
// Generates a character portrait with AI and stores it in Vercel Blob.
//
// Flow: admin POSTs a text prompt -> we call the OpenAI image model through the
// Vercel AI Gateway (AI SDK `generateImage`) -> we get raw image bytes ->
// we upload those bytes to Blob (so the image has a permanent public URL) ->
// we return that URL, which the form saves as the character's image_url.
//
// Needs two env vars:
//   AI_GATEWAY_API_KEY    - used automatically by the AI Gateway provider
//   BLOB_READ_WRITE_TOKEN - used automatically by @vercel/blob `put`
// ---------------------------------------------------------------------------

import { generateImage, gateway } from "ai";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
// Image generation can take a while; allow up to 60s on Vercel.
export const maxDuration = 60;

export async function POST(request) {
  // Only signed-in admins may generate images.
  const { data } = await auth.getSession();
  if (!data?.user || !isAdminEmail(data.user.email)) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const { prompt } = await request.json();
  if (!prompt || !prompt.trim()) {
    return Response.json(
      { error: "Add a name or appearance first so there's something to draw." },
      { status: 400 }
    );
  }

  try {
    // Which image model to use, via the AI Gateway. OpenAI's gpt-image models
    // are gated on the free tier, so we default to FLUX (great for fantasy
    // art). You can switch models WITHOUT a code change by setting the
    // PORTRAIT_IMAGE_MODEL env var in Vercel to any gateway image model id
    // (e.g. "google/imagen-4.0-generate-001", "xai/grok-imagine-image").
    const modelId = process.env.PORTRAIT_IMAGE_MODEL || "bfl/flux-pro-1.1";

    // No size/aspectRatio passed: defaults work across providers and avoid
    // "unsupported size" errors when swapping models.
    const { image } = await generateImage({
      model: gateway.imageModel(modelId),
      prompt,
    });

    // Persist the bytes to Blob so we have a stable public URL.
    const { url } = await put("characters/portrait.png", Buffer.from(image.uint8Array), {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: true,
    });

    return Response.json({ url });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
