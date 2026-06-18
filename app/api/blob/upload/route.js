// app/api/blob/upload/route.js
// ---------------------------------------------------------------------------
// Receives a device file upload and stores it in Vercel Blob (SERVER-SIDE).
// The browser POSTs the file as multipart form-data; we upload it with `put`
// and return the public URL. This avoids the client-upload "completion
// callback" flow, which fails on protected/preview deployments (the blocked
// callback returns an HTML page, which then breaks JSON parsing in the browser).
//
// Trade-off: the file passes through this function, so it's bounded by the
// platform request-body limit (~4.5 MB). That's plenty for a portrait.
// Requires BLOB_READ_WRITE_TOKEN in the environment.
// ---------------------------------------------------------------------------

import { put } from "@vercel/blob";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024; // ~4 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request) {
  try {
    // Only signed-in admins may upload.
    const { data } = await auth.getSession();
    if (!data?.user || !isAdminEmail(data.user.email)) {
      return Response.json({ error: "Not authorized." }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return Response.json({ error: "No file was provided." }, { status: 400 });
    }
    if (file.type && !ALLOWED.includes(file.type)) {
      return Response.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "Image is too large (max ~4 MB). Please use a smaller file." },
        { status: 400 }
      );
    }

    const { url } = await put(`characters/${file.name || "upload"}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return Response.json({ url });
  } catch (error) {
    return Response.json({ error: String(error?.message || error) }, { status: 500 });
  }
}
