"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowLeft, MapPin, RotateCw } from "lucide-react";
import ResourceImage from "@/components/ResourceImage";
import { listDirectProjects } from "@/lib/api/engineers";
import { useApiResource } from "@/lib/api/useApiResource";

const statusColors: Record<string, string> = {
  OPEN: "bg-[#fef08a] text-black",
  ASSIGNED: "bg-[#93c5fd] text-black",
  IN_PROGRESS: "bg-orange-400 text-white",
  COMPLETED: "bg-green-300 text-black",
  CANCELLED: "bg-gray-300 text-black",
};

function formatBudget(min?: number | string, max?: number | string) {
  const format = (value: number | string) => `$${Number(value).toLocaleString()}`;
  if (min != null && max != null) return `${format(min)} - ${format(max)}`;
  if (min != null) return `From ${format(min)}`;
  if (max != null) return `Up to ${format(max)}`;
  return "Budget not set";
}

// Same "[Category] rest..." unpacking as the my-projects list card — see
// app/(engineer)/engineer/my-projects/page.tsx for why the category isn't a
// real backend field.
function splitCategory(description?: string): { category: string | null; rest: string } {
  const match = description?.match(/^\[(\w+)\]\s*([\s\S]*)$/);
  if (match) return { category: match[1], rest: match[2] };
  return { category: null, rest: description ?? "" };
}

export default function ProjectDetailClient({ id }: { id: string }) {
  const router = useRouter();
  // There's no GET /engineers/direct-projects/{id} endpoint, so this reuses
  // the list (already fetched elsewhere via the same cache key) and picks
  // the matching project out of it — same approach as the client-side
  // project detail page.
  const { data: projects, loading, error, reload } = useApiResource(listDirectProjects, [], {
    pollMs: 30000,
  });
  const project = useMemo(
    () => (projects ?? []).find((p) => String(p.id) === id),
    [projects, id]
  );
  const { category, rest } = splitCategory(project?.description);

  if (loading) {
    return <div className="p-8 max-w-[1000px] mx-auto text-sm text-gray-500">Loading project…</div>;
  }

  if (error || !project) {
    return (
      <div className="p-8 max-w-[1000px] mx-auto space-y-4">
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>{error ?? "This project couldn't be found."}</span>
          <button
            type="button"
            onClick={reload}
            className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
        <button
          type="button"
          onClick={() => router.push("/engineer/my-projects")}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          &larr; Back to My Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-8">
      <button
        type="button"
        onClick={() => router.push("/engineer/my-projects")}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Projects
      </button>

      {/* Read-only here — uploading/replacing the project image is the
          client's call, not the assigned engineer's. */}
      <ResourceImage
        resource="projects"
        id={project.id}
        alt={project.title}
        className="w-full aspect-video object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        fallback={
          <div className="w-full aspect-video border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-100 flex items-center justify-center text-xs font-bold uppercase text-gray-400">
            No image yet
          </div>
        }
      />

      <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black">{project.title}</h1>
            {project.status && (
              <span
                className={`${
                  statusColors[project.status] ?? "bg-gray-100 text-black"
                } border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase`}
              >
                {project.status.replace("_", " ")}
              </span>
            )}
            {category && (
              <span className="bg-black text-white border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase">
                {category}
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Description</p>
          <p className="text-sm text-gray-700 leading-6">{rest || "No description provided."}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t-2 border-black mt-6 pt-6">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Project ID</p>
            <p className="font-bold">#{project.id}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Budget</p>
            <p className="font-bold">{formatBudget(project.budgetMin, project.budgetMax)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Location</p>
            <p className="font-bold flex items-center gap-1">
              {project.location ? (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  {project.location}
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
