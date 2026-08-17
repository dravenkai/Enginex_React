"use client";

import { List, Gauge, RotateCw } from "lucide-react";
import { getEngineerProfile, listDirectProjects } from "@/lib/api/engineers";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";

function formatBudget(min?: number | string, max?: number | string) {
  const format = (value: number | string) => `$${Number(value).toLocaleString()}`;
  if (min != null && max != null) return `${format(min)} - ${format(max)}`;
  if (min != null) return `From ${format(min)}`;
  if (max != null) return `Up to ${format(max)}`;
  return null;
}

export default function EngineerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useApiResource(getEngineerProfile, []);
  const displayName = profile?.name ?? user?.name;

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useApiResource(listDirectProjects, [], { pollMs: 30000 });
  const activeCount = projects?.length ?? 0;

  return (
    <div className="p-8 space-y-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center min-h-[200px]">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back{displayName ? `, ${displayName}` : ""}.
          </h1>
          <p className="text-gray-600 max-w-md font-medium text-sm">
            You have {activeCount} active project{activeCount === 1 ? "" : "s"} assigned to you
            right now.
          </p>
        </div>
        <div className="bg-[#fef08a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center h-full">
          <div className="bg-black text-white p-3 rounded-full mb-4">
            <Gauge className="w-8 h-8" />
          </div>
          <span className="text-md font-medium uppercase tracking-widest mb-1">System Status</span>
          <span className="text-base font-medium uppercase">Optimized</span>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-bold">Active Requests</h2>
          </div>
        </div>

        {projectsError && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4 mb-4">
            <span>Couldn&apos;t load your projects from the server.</span>
            <button
              type="button"
              onClick={reloadProjects}
              className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {!projectsLoading && activeCount === 0 && !projectsError && (
          <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
            No active requests yet. Assigned projects will show up here.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(projects ?? []).map((project) => (
            <article
              key={project.id}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                {project.status && (
                  <span className="bg-[#93c5fd] text-black border-2 border-black px-2 py-0.5 text-[10px] font-bold">
                    {project.status.replace("_", " ")}
                  </span>
                )}
                <span className="text-gray-400 text-xs font-medium">#{project.id}</span>
              </div>

              <h3 className="text-xl font-bold mb-2 leading-tight">{project.title}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">
                {project.description || "No description provided."}
              </p>

              <div className="border-t-2 border-black pt-4 flex items-center text-xs font-bold">
                {project.location && <span>{project.location}</span>}
                <span className="ml-auto">
                  {formatBudget(project.budgetMin, project.budgetMax) ?? "Budget not set"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
