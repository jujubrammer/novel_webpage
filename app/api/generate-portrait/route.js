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

// The image model to use, via the AI Gateway. OpenAI's gpt-image models are
// gated on the free tier, so we use FLUX (great for fantasy art). To change the
// art style later, edit this one line to another gateway image model id, e.g.
// "google/imagen-4.0-generate-001" or "xai/grok-imagine-image".
const PORTRAIT_MODEL = "bfl/flux-pro-1.1";

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
    // No size/aspectRatio passed: the model's default works fine and avoids
    // "unsupported size" errors.
    const { image } = await generateImage({
      model: gateway.imageModel(PORTRAIT_MODEL),
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
