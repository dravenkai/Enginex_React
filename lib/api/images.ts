import { apiRequest } from "./http";

// Matches the live OpenAPI contract at
// https://api.enginexmm.tech/api/docs/openapi.json — GET/POST/DELETE
// /images/{resource}/{id}, resource is one of these three.
export type ImageResource = "posts" | "projects" | "portfolios";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // Spec: 413 above 5 MB.

// GET /images/{resource}/{id} returns the image bytes directly (no JSON
// envelope, and no auth required per the spec), so this is just a URL for a
// plain <img src> — no need to fetch/decode it through apiRequest. `version`
// is an optional cache-buster (e.g. Date.now()) so a freshly uploaded or
// deleted image doesn't keep showing the browser's cached previous bytes.
export function resourceImageUrl(resource: ImageResource, id: number | string, version?: number | string) {
  const base = `/api/backend/images/${resource}/${id}`;
  return version != null ? `${base}?v=${version}` : base;
}

export async function uploadResourceImage(
  resource: ImageResource,
  id: number | string,
  file: File
): Promise<void> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Please choose a JPEG, PNG, or WEBP image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 5MB or smaller.");
  }
  const form = new FormData();
  form.append("image", file);
  await apiRequest(`/images/${resource}/${id}`, { method: "POST", body: form });
}

export const deleteResourceImage = (resource: ImageResource, id: number | string) =>
  apiRequest(`/images/${resource}/${id}`, { method: "DELETE" });
