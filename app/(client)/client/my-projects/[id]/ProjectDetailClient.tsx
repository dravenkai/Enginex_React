"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RotateCw, Users, ArrowLeft } from "lucide-react";
import { deleteProject, listClientProjects } from "@/lib/api/clients";
import { friendlyErrorMessage } from "@/lib/api/http";
import { useApiResource } from "@/lib/api/useApiResource";
import ApplicantsPanel from "../_components/ApplicantsPanel";
import ProjectImage from "./ProjectImage";

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

export default function ProjectDetailClient({ id }: { id: string }) {
  const router = useRouter();
  // There's no GET /clients/projects/{id} helper wired up yet, so this
  // reuses the list endpoint (already fetched elsewhere via the same cache
  // key) and picks the matching project out of it.
  const { data: projects, loading, error, reload } = useApiResource(listClientProjects, [], {
    pollMs: 30000,
  });
  const project = useMemo(
    () => (projects ?? []).find((p) => String(p.id) === id),
    [projects, id]
  );
  const [showApplicants, setShowApplicants] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [actionError, setActionError] = useState("");

  // Single DELETE endpoint (confirmed against the live API contract) — the
  // backend decides whether to hard-delete or cancel based on the project's
  // own state, so this always calls deleteProject; only the label/copy
  // changes depending on status.
  async function handleRemove() {
    if (!project) return;
    const isCancel = project.status !== "OPEN";
    const confirmed = window.confirm(
      isCancel
        ? `Cancel "${project.title}"? Engineers won't be able to apply or continue work on it.`
        : `Delete "${project.title}"? This can't be undone.`
    );
    if (!confirmed) return;
    setActionError("");
    setRemoving(true);
    try {
      await deleteProject(project.id);
      if (isCancel) {
        reload();
      } else {
        router.push("/client/my-projects");
      }
    } catch (err) {
      setActionError(
        friendlyErrorMessage(
          err,
          `Couldn't ${isCancel ? "cancel" : "delete"} "${project.title}". Please try again.`
        )
      );
    } finally {
      setRemoving(false);
    }
  }

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
          onClick={() => router.push("/client/my-projects")}
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
        onClick={() => router.push("/client/my-projects")}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Projects
      </button>

      <ProjectImage projectId={project.id} />

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
          </div>
          <div className="flex gap-2 shrink-0">
            {(project.status === "OPEN" ||
              project.status === "ASSIGNED" ||
              project.status === "IN_PROGRESS") && (
              <button
                type="button"
                disabled={removing}
                onClick={handleRemove}
                className={`h-10 px-4 border-2 border-black font-bold text-xs uppercase transition-colors disabled:opacity-60 ${
                  project.status === "OPEN"
                    ? "bg-red-100 hover:bg-red-200 text-red-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {removing
                  ? project.status === "OPEN"
                    ? "Deleting…"
                    : "Canceling…"
                  : project.status === "OPEN"
                    ? "Delete"
                    : "Cancel"}
              </button>
            )}
          </div>
        </div>

        {actionError && <p className="text-sm font-medium text-red-700 mb-4">{actionError}</p>}

        <div>
          <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Description</p>
          <p className="text-sm text-gray-700 leading-6">
            {project.description || "No description provided."}
          </p>
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
            <p className="font-bold">{project.location || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Created</p>
            <p className="font-bold">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Updated</p>
            <p className="font-bold">
              {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t-2 border-black">
          {project.selectedEngineerId ? (
            <Link
              href={`/client/marketplace/${project.selectedEngineerId}?from=project&projectId=${project.id}`}
              className="flex-1 border-2 border-black bg-[#93c5fd] hover:bg-[#7ca3ef] py-2.5 text-center font-bold text-xs uppercase transition-colors"
            >
              Engineer Profile
            </Link>
          ) : (
            <p className="flex-1 text-xs text-gray-500 border-2 border-dashed border-gray-300 px-3 py-2.5 text-center">
              No engineer assigned yet
            </p>
          )}
        </div>
      </section>

      <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <button
          type="button"
          onClick={() => setShowApplicants((current) => !current)}
          className="w-full flex items-center justify-between px-6 py-4 font-bold text-sm uppercase hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Applicants
          </span>
          <span className="text-xs text-gray-500">{showApplicants ? "Hide" : "Show"}</span>
        </button>
        {showApplicants && <ApplicantsPanel project={project} onAssigned={reload} />}
      </section>
    </div>
  );
}
