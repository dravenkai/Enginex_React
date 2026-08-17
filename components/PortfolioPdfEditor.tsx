"use client";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { createPortfolioEntry, uploadPortfolioPdf } from "@/lib/api/portfolio";
import { friendlyErrorMessage } from "@/lib/api/http";

/**
 * Uploads a portfolio PDF via the two-step live-API flow (create the
 * portfolio entry, then attach the PDF to the id it returns — see
 * lib/api/portfolio.ts for the caveats on the exact request/response
 * shapes). There's no confirmed way to list existing entries, so this can't
 * show what's already been uploaded — it only reflects the outcome of an
 * upload made in this session.
 */
export default function PortfolioPdfEditor() {
  const [status, setStatus] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("uploading");
    try {
      const entry = await createPortfolioEntry();
      await uploadPortfolioPdf(entry.id, file);
      setFileName(file.name);
      setStatus("uploaded");
    } catch (err) {
      setError(friendlyErrorMessage(err, "Couldn't upload this PDF. Please try again."));
      setStatus("error");
    }
  }

  const busy = status === "uploading";

  return (
    <div>
      <label
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black bg-gray-50 py-8 text-center cursor-pointer transition-colors ${
          busy ? "opacity-60 pointer-events-none" : "hover:bg-gray-100"
        }`}
      >
        {status === "uploaded" ? (
          <FileText className="w-6 h-6 text-green-700" />
        ) : (
          <Upload className="w-6 h-6" />
        )}
        <span className="text-xs font-bold px-4 truncate max-w-full">
          {busy ? "Uploading…" : status === "uploaded" && fileName ? fileName : "Upload Portfolio PDF"}
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={busy}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
      {error && <p className="mt-2 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
