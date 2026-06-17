// app/api/blob/upload/route.js
// ---------------------------------------------------------------------------
// Authorizes browser → Vercel Blob uploads. The browser doesn't get our secret
// token; instead the PhotoUploader calls this route, we verify the user is an
// admin, and `handleUpload` hands back a short-lived token so the file uploads
// DIRECTLY from the browser to Blob (so big photos don't pass through this
// server function). Requires BLOB_READ_WRITE_TOKEN in the environment.
// ---------------------------------------------------------------------------

import { handleUpload } from "@vercel/blob/client";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admin";

export async function POST(request) {
  const body = await request.json();
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Only a signed-in admin may upload.
        const { data } = await auth.getSession();
        if (!data?.user || !isAdminEmail(data.user.email)) {
          throw new Error("Not authorized to upload.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
          ],
          addRandomSuffix: true, // avoid filename collisions
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB cap
        };
      },
      // Runs after the upload finishes. We don't need to do anything here —
      // the returned URL is saved when the character form is submitted.
      onUploadCompleted: async () => {},
    });
    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json({ error: String(error?.message || error) }, { status: 400 });
  }
}
