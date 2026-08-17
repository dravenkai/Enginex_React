"use client";

import Link from "next/link";
import WelcomeBanner from "./_components/WelcomeBanner";
import StatusCard from "./_components/StatusCard";
import EngineerCard from "./_components/EngineerCard";
import { List, Star, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import ResourceImage from "@/components/ResourceImage";
import { getClientProfile, listClientProjects, searchEngineers } from "@/lib/api/clients";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";
import { fallbackAvatar } from "@/lib/constants/avatars";

const specializationLabels: Record<string, string> = {
  CIVIL: "Civil Engineer",
  ARCHITECT: "Architect",
  MECHANICAL: "Mechanical Engineer",
  ELECTRICAL: "Electrical Engineer",
};

const statusColors: Record<string, string> = {
  OPEN: "bg-[#fef08a] text-black",
  ASSIGNED: "bg-[#93c5fd] text-black",
  IN_PROGRESS: "bg-orange-400 text-white",
  COMPLETED: "bg-green-300 text-black",
  CANCELLED: "bg-gray-300 text-black",
};

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useApiResource(getClientProfile, []);
  const name = profile?.name ?? user?.name ?? "";

  const {
    data: engineers,
    loading: engineersLoading,
    error: engineersError,
    reload: reloadEngineers,
  } = useApiResource(() => searchEngineers(""), []);
  const recommended = (engineers ?? []).slice(0, 6);

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useApiResource(listClientProjects, [], { pollMs: 30000 });
  const activeProjects = (projects ?? []).filter((p) => p.status !== "COMPLETED" && p.status !== "CANCELLED");

  return (
    <div className="p-8 space-y-12 max-w-[1400px] mx-auto">
      {/* Top Section: Welcome and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WelcomeBanner name={name} engineerCount={engineers?.length ?? 0} />
        </div>
        <div>
          <StatusCard />
        </div>
      </div>

      {/* Active Requests Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl">Active Requests</h2>
          </div>
          <Link href="/client/my-projects" className="text-sm font-bold text-blue-600 hover:underline">
            View All
          </Link>
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

        {!projectsLoading && activeProjects.length === 0 && !projectsError && (
          <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
            No active requests yet. Post a project or assign one from the Marketplace to see it here.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProjects.slice(0, 3).map((project) => (
            <article
              key={project.id}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full overflow-hidden"
            >
              <ResourceImage
                resource="projects"
                id={project.id}
                alt={project.title}
                className="w-full h-32 object-cover border-b-4 border-black"
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  {project.status && (
                    <span
                      className={`${statusColors[project.status] ?? "bg-gray-100 text-black"} border-2 border-black px-2 py-0.5 text-[10px] font-bold`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  )}
                  <span className="text-gray-400 text-xs font-medium">#{project.id}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 leading-tight">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">
                  {project.description || "No description provided."}
                </p>
                <Link
                  href={`/client/my-projects/${project.id}`}
                  className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-tighter"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recommended Engineers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-700 fill-blue-700" />
            <h2 className="text-xl font-normal">Recommended Engineers</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-1 border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {engineersError && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4 mb-4">
            <span>Couldn&apos;t load engineers from the server.</span>
            <button
              type="button"
              onClick={reloadEngineers}
              className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommended.map((engineer) => (
            <EngineerCard
              key={engineer.id}
              slug={String(engineer.id)}
              name={engineer.name ?? "Engineer"}
              role={
                engineer.specialization ? specializationLabels[engineer.specialization] : "Engineer"
              }
              avatarUrl={engineer.avatarUrl}
              fallbackAvatar={fallbackAvatar(engineer.id, engineer.name)}
              tags={[
                engineer.location,
                engineer.yearsOfExperience != null ? `${engineer.yearsOfExperience} yrs` : null,
                engineer.hourlyRate != null ? `$${engineer.hourlyRate}/hr` : null,
              ].filter((tag): tag is string => Boolean(tag))}
            />
          ))}
          {!engineersLoading && recommended.length === 0 && !engineersError && (
            <p className="text-sm text-gray-500 py-6">No engineers available right now.</p>
          )}
        </div>
      </section>
    </div>
  );
}
