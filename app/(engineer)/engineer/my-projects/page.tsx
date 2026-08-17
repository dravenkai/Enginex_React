"use client";

import Link from "next/link";
import { Briefcase, Hourglass, CheckCircle2, MapPin, RotateCw, X } from "lucide-react";
import ResourceImage from "@/components/ResourceImage";
import { listDirectProjects, listMyApplications, listOpenProjects, type DirectProject } from "@/lib/api/engineers";
import { useApiResource } from "@/lib/api/useApiResource";
import { useDismissedIds } from "@/lib/useDismissedIds";

// PENDING intentionally has no entry — it's not a decision the client has
// made yet, so it doesn't get a status badge here, just a plain "Awaiting
// review" label (see the table cell below). Only a real outcome (accepted/
// rejected) gets the colored chip treatment.
const applicationStatusColors: Record<string, string> = {
  ACCEPTED: "bg-green-300 text-black",
  REJECTED: "bg-red-200 text-black",
};

const projectStatusColors: Record<string, string> = {
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

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString();
}

// The client's "New Project" form has nowhere to persist a category on the
// backend, so it folds it into the description as a "[Category] rest..."
// prefix instead (see app/(client)/client/request/page.tsx). Opportunistically
// pulling that back out here gives a real category tag on the card — when it
// isn't present (e.g. a directly-assigned project created another way) this
// just falls through to showing the description as-is.
function splitCategory(description?: string): { category: string | null; rest: string } {
  const match = description?.match(/^\[(\w+)\]\s*([\s\S]*)$/);
  if (match) return { category: match[1], rest: match[2] };
  return { category: null, rest: description ?? "" };
}

// An engineer can't delete an assignment outright — there's no backend
// endpoint for that, and it isn't really theirs to delete. But once a
// project is closed out (completed/cancelled) it's just clutter, so those
// statuses get a dismiss control that hides the card locally.
const DISMISSIBLE_PROJECT_STATUSES = new Set(["COMPLETED", "CANCELLED"]);

function ProjectCard({ project, onDismiss }: { project: DirectProject; onDismiss?: () => void }) {
  const { category, rest } = splitCategory(project.description);
  const description = rest || "No description provided.";

  return (
    <article className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={`Remove ${project.title} from this list`}
          title="Remove from this list"
          className="absolute -top-3 -right-3 z-10 w-7 h-7 border-2 border-black bg-white hover:bg-red-100 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="relative h-28 border-b-4 border-black shrink-0">
        <ResourceImage
          resource="projects"
          id={project.id}
          alt={project.title}
          className="w-full h-full object-cover"
          fallback={
            <div className="w-full h-full bg-[#dbe6fb] flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-blue-900/40" />
            </div>
          }
        />
        {category && (
          <span className="absolute top-3 right-3 bg-black text-white border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase">
            {category}
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-xl leading-tight">{project.title}</h3>
          {project.status && (
            <span
              className={`border-2 border-black px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                projectStatusColors[project.status] ?? "bg-gray-100 text-black"
              }`}
            >
              {project.status.replace("_", " ")}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">{description}</p>

        <div className="flex items-center gap-4 text-xs font-bold pt-4 border-t-2 border-black">
          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {project.location}
            </span>
          )}
          <span className="ml-auto">{formatBudget(project.budgetMin, project.budgetMax)}</span>
        </div>

        <Link
          href={`/engineer/my-projects/${project.id}`}
          className="mt-4 block w-full py-3 bg-[#93c5fd] hover:bg-[#7ca3ef] border-2 border-black font-bold text-xs uppercase text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default function MyProjectsPage() {
  const {
    data: projects,
    loading,
    error,
    reload,
  } = useApiResource(listDirectProjects, [], { pollMs: 30000 });
  const activeCount = projects?.length ?? 0;

  const {
    data: applications,
    loading: applicationsLoading,
    error: applicationsError,
    reload: reloadApplications,
  } = useApiResource(listMyApplications, [], { pollMs: 30000 });
  const pendingCount = (applications ?? []).filter((a) => a.status === "PENDING").length;
  const reviewedCount = (applications ?? []).filter((a) => a.status && a.status !== "PENDING").length;

  const dismissedProjects = useDismissedIds("enginex.engineerMyProjects.dismissedProjects");
  const dismissedApplications = useDismissedIds("enginex.engineerMyProjects.dismissedApplications");
  const visibleProjects = (projects ?? []).filter((project) => !dismissedProjects.isDismissed(project.id));
  const visibleApplications = (applications ?? []).filter(
    (application) => !dismissedApplications.isDismissed(application.id)
  );

  // The applications endpoint doesn't include a project title, and there's
  // no per-project detail endpoint for engineers — so resolve titles from
  // whatever project lists are already available (assigned + still-open).
  // Note: this won't cover every application (a project you applied to that
  // later closed/reassigned elsewhere won't appear in either list), so it
  // falls back to "Project #id" rather than guessing.
  const { data: openProjects } = useApiResource(listOpenProjects, []);
  const projectTitles = new Map<number, string>();
  for (const project of projects ?? []) projectTitles.set(project.id, project.title);
  for (const project of openProjects ?? []) projectTitles.set(project.id, project.title);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#93c5fd] border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-700">Active Assignments</p>
            <p className="text-4xl font-black mt-1">{activeCount}</p>
          </div>
          <Briefcase className="w-6 h-6" />
        </div>
        <div className="bg-[#fef08a] border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-700">Pending Bids</p>
            <p className="text-4xl font-black mt-1">{pendingCount}</p>
          </div>
          <Hourglass className="w-6 h-6" />
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Completed Reviews</p>
            <p className="text-4xl font-black mt-1">{reviewedCount}</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-black">Active Projects</h2>
          {dismissedProjects.dismissedCount > 0 && (
            <button
              type="button"
              onClick={dismissedProjects.restoreAll}
              className="text-xs font-bold text-blue-600 hover:underline shrink-0"
            >
              {dismissedProjects.dismissedCount} hidden — Show all
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4 mb-4">
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

        {!loading && activeCount === 0 && !error && (
          <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
            No active projects yet. Assigned projects will show up here.
          </p>
        )}

        {!loading && activeCount > 0 && visibleProjects.length === 0 && (
          <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
            All caught up — every assignment here has been hidden.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDismiss={
                project.status && DISMISSIBLE_PROJECT_STATUSES.has(project.status)
                  ? () => dismissedProjects.dismiss(project.id)
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-black">Submitted Applications</h2>
          {dismissedApplications.dismissedCount > 0 && (
            <button
              type="button"
              onClick={dismissedApplications.restoreAll}
              className="text-xs font-bold text-blue-600 hover:underline shrink-0"
            >
              {dismissedApplications.dismissedCount} hidden — Show all
            </button>
          )}
        </div>

        {applicationsError && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4 mb-4">
            <span>Couldn&apos;t load your applications from the server.</span>
            <button
              type="button"
              onClick={reloadApplications}
              className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {!applicationsLoading && (applications ?? []).length === 0 && !applicationsError && (
          <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
            No applications submitted yet.
          </p>
        )}

        {!applicationsLoading && (applications ?? []).length > 0 && visibleApplications.length === 0 && (
          <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
            All caught up — every application here has been hidden.
          </p>
        )}

        {visibleApplications.length > 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-4 border-black">
                  <th className="px-6 py-4 text-xs font-bold uppercase">Project</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase">Bid Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase">Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase w-10" />
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((application, index) => (
                  <tr
                    key={application.id}
                    className={index !== visibleApplications.length - 1 ? "border-b-2 border-black" : ""}
                  >
                    <td className="px-6 py-5 font-bold">
                      {projectTitles.get(application.projectId) ?? `Project #${application.projectId}`}
                    </td>
                    <td className="px-6 py-5 font-mono">
                      {application.proposedPrice != null ? `$${application.proposedPrice}` : "—"}
                    </td>
                    <td className="px-6 py-5 text-gray-600">{formatDate(application.createdAt) ?? "—"}</td>
                    <td className="px-6 py-5">
                      {application.status === "ACCEPTED" || application.status === "REJECTED" ? (
                        <span
                          className={`border-2 border-black px-2 py-1 text-[10px] font-bold uppercase ${applicationStatusColors[application.status]}`}
                        >
                          {application.status}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-gray-500">Awaiting review</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {/* Only REJECTED is safe to hide — PENDING is still
                          awaiting a decision and ACCEPTED is a real active
                          assignment, so both stay visible. */}
                      {application.status === "REJECTED" && (
                        <button
                          type="button"
                          onClick={() => dismissedApplications.dismiss(application.id)}
                          aria-label="Remove from this list"
                          title="Remove from this list"
                          className="w-7 h-7 border-2 border-black bg-white hover:bg-red-100 flex items-center justify-center"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
