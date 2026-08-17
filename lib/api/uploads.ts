import { apiRequest } from "./http";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * Uploads raw image bytes to the backend (it wants the bytes directly, not
 * multipart form data — see POST /uploads/images in the OpenAPI spec) and
 * returns the URL to store on a profile (avatarUrl / profileImage / etc).
 *
 * The spec doesn't document the response body shape, so this looks for the
 * URL under a handful of likely keys rather than assuming one exact shape.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Please choose a JPEG, PNG, WEBP, or GIF image.");
  }

  const response = await apiRequest<unknown>("/uploads/images", {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  const url = extractImageUrl(response);
  if (!url) {
    throw new Error("Upload succeeded but the server didn't return an image URL.");
  }
  return url;
}

function extractImageUrl(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    for (const key of ["url", "imageUrl", "avatarUrl", "profileImage", "link", "location", "path"]) {
      const inner = (value as Record<string, unknown>)[key];
      if (typeof inner === "string") return inner;
    }
    if ("data" in value) return extractImageUrl((value as Record<string, unknown>).data);
  }
  return null;
}
