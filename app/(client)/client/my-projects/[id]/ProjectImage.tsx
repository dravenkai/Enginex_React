"use client";

import { useRef, useState } from "react";
import { ImageOff, Trash2, Upload } from "lucide-react";
import { deleteResourceImage, resourceImageUrl, uploadResourceImage } from "@/lib/api/images";
import { friendlyErrorMessage } from "@/lib/api/http";

export default function ProjectImage({ projectId }: { projectId: number }) {
  // null = still checking whether one exists (GET 404s when there's none —
  // that's expected, not an error), true/false once we know.
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
      await uploadResourceImage("projects", projectId, file);
      setVersion((current) => current + 1);
      setHasImage(true);
    } catch (err) {
      setError(friendlyErrorMessage(err, "Couldn't upload this image. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Remove this project's image?")) return;
    setError("");
    setBusy(true);
    try {
      await deleteResourceImage("projects", projectId);
      setVersion((current) => current + 1);
      setHasImage(false);
    } catch (err) {
      setError(friendlyErrorMessage(err, "Couldn't remove this image. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black">
        <h2 className="font-bold text-sm uppercase">Project Image</h2>
        <div className="flex items-center gap-2">
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
              aria-label="Remove project image"
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
      </div>

      <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
        {hasImage !== false && (
          // eslint-disable-next-line @next/next/no-img-element -- served by our own proxy, next/image can't optimize a route handler response
          <img
            src={resourceImageUrl("projects", projectId, version || undefined)}
            alt=""
            className="w-full h-full object-cover"
            onLoad={() => setHasImage(true)}
            onError={() => setHasImage(false)}
          />
        )}
        {hasImage === false && (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageOff className="w-8 h-8" />
            <p className="text-xs font-medium">No image yet</p>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-xs font-bold uppercase">
            Working…
          </div>
        )}
      </div>

      {error && <p className="px-6 py-3 text-sm font-medium text-red-700 border-t-2 border-black">{error}</p>}
    </section>
  );
}
