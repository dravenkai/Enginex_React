"use client";

import { useState } from "react";
import { Briefcase, MapPin, RotateCw } from "lucide-react";
import { applyToProject, listDirectProjects } from "@/lib/api/engineers";
import { useApiResource } from "@/lib/api/useApiResource";
import { ApiError } from "@/lib/api/http";

export default function EngineerMarketplacePage() {
  const { data: projects, loading, error, reload } = useApiResource(listDirectProjects, []);
  const [applyState, setApplyState] = useState<
    Record<number, { status: "idle" | "applying" | "applied" | "error"; message?: string }>
  >({});

  async function handleApply(id: number) {
    setApplyState((current) => ({ ...current, [id]: { status: "applying" } }));
    try {
      await applyToProject(id, {});
      setApplyState((current) => ({ ...current, [id]: { status: "applied" } }));
    } catch (err) {
      setApplyState((current) => ({
        ...current,
        [id]: {
          status: "error",
          message: err instanceof ApiError ? err.message : "Something went wrong.",
        },
      }));
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black">Engineer Marketplace</h1>
        <p className="mt-2 text-gray-600 italic">
          &quot;Discover active project requests submitted by verified clients.&quot;
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load projects from the server: {error}</span>
          <button
            type="button"
            onClick={reload}
            className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(projects ?? []).map((project) => {
          const state = applyState[project.id]?.status ?? "idle";
          return (
            <article
              key={project.id}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <h3 className="font-bold text-sm uppercase leading-tight">{project.title}</h3>
                </div>
                {project.location && (
                  <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </p>
                )}
                <p className="text-sm text-gray-600 flex-1 mb-4">
                  {project.description || "No description provided."}
                </p>
                {(project.budgetMin != null || project.budgetMax != null) && (
                  <p className="text-xs font-bold uppercase mb-4">
                    Budget: ${project.budgetMin ?? "?"} – ${project.budgetMax ?? "?"}
                  </p>
                )}

                <button
                  type="button"
                  disabled={state === "applying" || state === "applied"}
                  onClick={() => handleApply(project.id)}
                  className={`w-full border-2 border-black py-2.5 text-xs font-bold uppercase text-center transition-colors ${
                    state === "applied"
                      ? "bg-[#86efac]"
                      : "bg-[#fef08a] hover:bg-[#f5e35a] disabled:opacity-60"
                  }`}
                >
                  {state === "applied"
                    ? "Applied"
                    : state === "applying"
                      ? "Applying…"
                      : "Apply to Project"}
                </button>
                {applyState[project.id]?.status === "error" && (
                  <p className="text-xs text-red-600 font-medium mt-2">
                    {applyState[project.id]?.message}
                  </p>
                )}
              </div>
            </article>
          );
        })}
        {!loading && (projects ?? []).length === 0 && !error && (
          <p className="col-span-full text-center font-bold text-gray-500 py-12">
            No open projects right now.
          </p>
        )}
      </div>
    </div>
  );
}
