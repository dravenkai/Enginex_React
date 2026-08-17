"use client";

import { useRef, useState } from "react";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { deleteResourceImage, resourceImageUrl, uploadResourceImage, type ImageResource } from "@/lib/api/images";
import { friendlyErrorMessage } from "@/lib/api/http";

/**
 * Upload/replace/delete control for a single post/project/portfolio image
 * (GET/POST/DELETE /images/{resource}/{id}). Shared by anywhere that needs
 * to manage one of these — the project detail page and the engineer's
 * portfolio slot on profile edit, so far.
 */
export default function ResourceImageEditor({
  resource,
  id,
  emptyLabel = "No image yet",
  aspectClassName = "aspect-video",
}: {
  resource: ImageResource;
  id: number;
  emptyLabel?: string;
  aspectClassName?: string;
}) {
  const [hasImage, setHasImage] = useState<boolean | null>(null);
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      await uploadResourceImage(resource, id, file);
      setVersion((current) => current + 1);
      setHasImage(true);
    } catch (err) {
      setError(friendlyErrorMessage(err, "Couldn't upload this image. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Remove this image?")) return;
    setError("");
    setBusy(true);
    try {
      await deleteResourceImage(resource, id);
      setVersion((current) => current + 1);
      setHasImage(false);
    } catch (err) {
      setError(friendlyErrorMessage(err, "Couldn't remove this image. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
          className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100 disabled:opacity-60"
        >
          <Upload className="w-3.5 h-3.5" />
          {hasImage ? "Replace" : "Upload"}
        </button>
        {hasImage && (
          <button
            type="button"
            disabled={busy}
            onClick={handleDelete}
            aria-label="Remove image"
            className="w-8 h-8 border-2 border-black bg-red-100 hover:bg-red-200 flex items-center justify-center disabled:opacity-60"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-700" />
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      <div
        className={`${aspectClassName} bg-gray-100 border-2 border-black flex items-center justify-center relative overflow-hidden`}
      >
        {hasImage !== false && (
          // eslint-disable-next-line @next/next/no-img-element -- served by our own proxy, next/image can't optimize a route handler response
          <img
            src={resourceImageUrl(resource, id, version || undefined)}
            alt=""
            className="w-full h-full object-cover"
            onLoad={() => setHasImage(true)}
            onError={() => setHasImage(false)}
          />
        )}
        {hasImage === false && (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageOff className="w-8 h-8" />
            <p className="text-xs font-medium">{emptyLabel}</p>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-xs font-bold uppercase">
            Working…
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
