"use client";

import { useState } from "react";
import { ClipboardList, UploadCloud } from "lucide-react";
import type { Project } from "../../_data";

export default function ApplyPanel({ project }: { project: Project }) {
  const [confirmed, setConfirmed] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <section className="bg-white border-3 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="flex items-center gap-2 font-black text-lg uppercase">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        Apply for Project
      </h2>
      <p className="text-xs text-gray-500 mt-1 pb-4 border-b-2 border-black">
        Submission deadline: {project.deadline}
      </p>

      <label className="block mt-5">
        <span className="block text-xs font-bold uppercase mb-1">Proposed Timeline (Weeks)</span>
        <div className="relative">
          <input
            type="number"
            placeholder="e.g. 18"
            className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
            WKS
          </span>
        </div>
      </label>

      <label className="block mt-5">
        <span className="block text-xs font-bold uppercase mb-1">Technical Approach Summary</span>
        <textarea
          rows={4}
          placeholder="Describe your methodology (Finite Element Analysis, Field Testing, etc.)"
          className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-y"
        />
      </label>

      <div className="mt-5">
        <span className="block text-xs font-bold uppercase mb-1">Relevant Experience</span>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black bg-gray-50 hover:bg-gray-100 py-8 text-center cursor-pointer transition-colors">
          <UploadCloud className="w-6 h-6" />
          {fileName ? (
            <span className="text-xs font-bold px-4">{fileName}</span>
          ) : (
            <span className="text-xs text-gray-500 px-4">
              Upload Portfolio or Case Study PDF
              <br />
              (Max 10MB)
            </span>
          )}
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 mt-5 bg-gray-100 border-2 border-black p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0"
        />
        <span className="text-xs font-medium leading-5">
          I confirm I hold the required {project.category.toLowerCase()} engineering
          certifications for this region.
        </span>
      </label>

      <button
        type="button"
        className="w-full mt-5 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] py-4 font-black text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
      >
        Submit Application
      </button>

      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>{project.applicantsCount} Engineers Applied</span>
        <span className="text-blue-600 font-bold">Verified Client</span>
      </div>
    </section>
  );
}
