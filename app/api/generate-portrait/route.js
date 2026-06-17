// app/api/generate-portrait/route.js
// ---------------------------------------------------------------------------
// Generates a character portrait in TWO passes and stores it in Vercel Blob.
//
//   Pass 1 (text model): turn the character's form fields into one vivid,
//           concrete image-generation prompt.
//   Pass 2 (image model): render that prompt. If the form already has an image
//           (an upload or a previous portrait), we pass it in as a REFERENCE so
//           the new portrait keeps the same character (image-to-image editing).
//
// Then we upload the bytes to Blob and return the public URL.
//
// Needs env vars: AI_GATEWAY_API_KEY (gateway) and BLOB_READ_WRITE_TOKEN (blob).
// ---------------------------------------------------------------------------

import { generateText, generateImage, gateway } from "ai";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // two model calls; image gen can be slow

// Models (via the AI Gateway). Edit these to change style/quality.
const PROMPT_MODEL = "openai/gpt-5-mini"; // pass 1: writes the image prompt
const IMAGE_MODEL = "openai/gpt-image-2"; // pass 2: renders the image

export async function POST(request) {
  // Only signed-in admins may generate images.
  const { data } = await auth.getSession();
  if (!data?.user || !isAdminEmail(data.user.email)) {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }

  const { character, referenceUrl } = await request.json();

  // Turn the filled-in fields into a readable block for the text model.
  const details = Object.entries(character || {})
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${String(v).trim()}`)
    .join("\n");

  if (!details) {
    return Response.json(
      { error: "Fill in at least a name, species, or appearance first." },
      { status: 400 }
    );
  }

  try {
    // --- Pass 1: text model writes a vivid image prompt from the details. ---
    const { text } = await generateText({
      model: PROMPT_MODEL,
      prompt:
        "You are an art director for a fantasy encyclopedia. Using the character " +
        "details below, write ONE vivid, concrete prompt for a head-and-shoulders " +
        "character portrait. Emphasize visual specifics: face, hair, skin, clothing, " +
        "colors, mood, and lighting. Style: detailed painted illustration, muted " +
        "parchment tones, single character, no text. Output ONLY the prompt.\n\n" +
        details,
    });
    const imagePrompt = text.trim();

    // --- Pass 2: image model renders it (optionally editing a reference). ---
    let promptArg = imagePrompt;
    if (referenceUrl) {
      // Fetch the existing image (public Blob URL) to use as a starting point.
      const refRes = await fetch(referenceUrl);
      if (refRes.ok) {
        const refBytes = new Uint8Array(await refRes.arrayBuffer());
        promptArg = { images: [refBytes], text: imagePrompt };
      }
    }

    const { image } = await generateImage({
      model: gateway.imageModel(IMAGE_MODEL),
      prompt: promptArg,
    });

    // Persist to Blob so we have a stable public URL.
    const { url } = await put("characters/portrait.png", Buffer.from(image.uint8Array), {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: true,
    });

    return Response.json({ url, imagePrompt });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
