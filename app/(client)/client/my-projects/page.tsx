"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, RotateCw, Users } from "lucide-react";
import ResourceImage from "@/components/ResourceImage";
import { deleteProject, listClientProjects, type ClientProject } from "@/lib/api/clients";
import { friendlyErrorMessage } from "@/lib/api/http";
import { useApiResource } from "@/lib/api/useApiResource";
import ApplicantsPanel from "./_components/ApplicantsPanel";

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

export default function MyProjectsPage() {
  const { data: projects, loading, error, reload } = useApiResource(listClientProjects, [], {
    pollMs: 30000,
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  // There's a single DELETE endpoint for a project (confirmed against the
  // live API contract) — the backend decides whether that hard-deletes it or
  // marks it cancelled based on the project's own state (nothing attached
  // yet vs. already has an engineer/applicants). The UI just labels the
  // button "Delete" or "Cancel" depending on status; both call deleteProject.
  const deletableProjects = (projects ?? []).filter((project) => project.status === "OPEN");

  async function handleRemove(project: ClientProject) {
    const isCancel = project.status !== "OPEN";
    const confirmed = window.confirm(
      isCancel
        ? `Cancel "${project.title}"? Engineers won't be able to apply or continue work on it.`
        : `Delete "${project.title}"? This can't be undone.`
    );
    if (!confirmed) return;
    setActionError("");
    setRemovingId(project.id);
    try {
      await deleteProject(project.id);
      reload();
    } catch (err) {
      setActionError(
        friendlyErrorMessage(
          err,
          `Couldn't ${isCancel ? "cancel" : "delete"} "${project.title}". Please try again.`
        )
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function handleDeleteAll() {
    if (deletableProjects.length === 0) return;
    if (
      !window.confirm(
        `Delete all ${deletableProjects.length} open request${deletableProjects.length === 1 ? "" : "s"}? This can't be undone.`
      )
    ) {
      return;
    }
    setBulkMessage("");
    setBulkDeleting(true);
    try {
      const results = await Promise.allSettled(deletableProjects.map((project) => deleteProject(project.id)));
      const failed = results.filter((result) => result.status === "rejected").length;
      const succeeded = results.length - failed;
      setBulkMessage(
        failed === 0
          ? `Deleted ${succeeded} request${succeeded === 1 ? "" : "s"}.`
          : `Deleted ${succeeded} request${succeeded === 1 ? "" : "s"} — ${failed} couldn't be deleted. Try again for those.`
      );
      reload();
    } finally {
      setBulkDeleting(false);
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">My Projects</h2>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "Loading…" : `${projects?.length ?? 0} request${(projects?.length ?? 0) === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {deletableProjects.length > 0 && (
            <button
              type="button"
              disabled={bulkDeleting}
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-5 py-3 border-2 border-black bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs uppercase transition-colors disabled:opacity-60"
            >
              {bulkDeleting ? "Deleting…" : `Delete All Open (${deletableProjects.length})`}
            </button>
          )}
          <Link
            href="/client/request"
            className="flex items-center gap-2 px-5 py-3 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {bulkMessage && (
        <p aria-live="polite" className="text-sm font-medium text-blue-700">
          {bulkMessage}
        </p>
      )}
      {actionError && (
        <p aria-live="polite" className="text-sm font-medium text-red-700">
          {actionError}
        </p>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load your projects from the server.</span>
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

      {!loading && (projects ?? []).length === 0 && !error && (
        <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
          No projects yet. Deploy a request to get started.
        </p>
      )}

      <div className="space-y-5">
        {(projects ?? []).map((project) => (
          <article
            key={project.id}
            className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <ResourceImage
                    resource="projects"
                    id={project.id}
                    alt={project.title}
                    className="w-16 h-16 border-2 border-black object-cover shrink-0"
                  />
                  <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    {project.status && (
                      <span
                        className={`border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase ${
                          statusColors[project.status] ?? "bg-gray-100 text-black"
                        }`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm text-gray-500 font-medium ${
                      expandedDescriptions[project.id] ? "" : "line-clamp-2"
                    }`}
                  >
                    {project.description || "No description"}
                  </p>
                  {(project.description?.length ?? 0) > 140 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDescriptions((current) => ({
                          ...current,
                          [project.id]: !current[project.id],
                        }))
                      }
                      className="text-xs font-bold text-blue-600 hover:underline mt-1"
                    >
                      {expandedDescriptions[project.id] ? "See less" : "See more"}
                    </button>
                  )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <strong className="border-2 border-black px-3 py-2 bg-[#fef08a] text-sm font-mono">
                    {formatBudget(project.budgetMin, project.budgetMax)}
                  </strong>
                  <Link
                    href={`/client/my-projects/${project.id}`}
                    className="h-11 px-4 border-2 border-black bg-white font-bold text-xs uppercase hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpandedId((current) => (current === project.id ? null : project.id))}
                    className="h-11 px-4 border-2 border-black bg-white font-bold text-xs uppercase hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Applicants
                  </button>
                  {(project.status === "OPEN" ||
                    project.status === "ASSIGNED" ||
                    project.status === "IN_PROGRESS") && (
                    <button
                      type="button"
                      disabled={removingId === project.id}
                      onClick={() => handleRemove(project)}
                      className={`h-11 px-4 border-2 border-black font-bold text-xs uppercase transition-colors disabled:opacity-60 ${
                        project.status === "OPEN"
                          ? "bg-red-100 hover:bg-red-200 text-red-700"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {removingId === project.id
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
            </div>

            {expandedId === project.id && (
              <ApplicantsPanel project={project} onAssigned={reload} />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
