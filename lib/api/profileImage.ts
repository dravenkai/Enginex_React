import { apiRequest } from "./http";

// Matches the live OpenAPI contract — POST/DELETE /users/profile-image (the
// authenticated user's own image) and GET /users/{id}/profile-image (anyone's,
// by user id — no auth required per the spec). This is the purpose-built
// profile-picture flow, distinct from the generic POST /uploads/images +
// avatarUrl-field approach used elsewhere (lib/api/uploads.ts) — that one
// hands back a direct storage URL that's turned out to be unreliable (the
// bucket serving those rejects most reads with 403). Images served through
// this endpoint go through the backend itself, proxied through our own
// /api/backend, so they aren't subject to that.
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024; // Spec: 413 above 5 MB.

export function profileImageUrl(userId: number | string, version?: number | string) {
  const base = `/api/backend/users/${userId}/profile-image`;
  return version != null ? `${base}?v=${version}` : base;
}

export async function uploadProfileImage(file: File): Promise<void> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Please choose a JPEG, PNG, or WEBP image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 5MB or smaller.");
  }
  const form = new FormData();
  form.append("image", file);
  await apiRequest("/users/profile-image", { method: "POST", body: form });
}

export const deleteProfileImage = () => apiRequest("/users/profile-image", { method: "DELETE" });
