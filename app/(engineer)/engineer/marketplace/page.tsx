"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Briefcase, MapPin, RotateCw, Search } from "lucide-react";
import ResourceImage from "@/components/ResourceImage";
import { listMyApplications, listOpenProjects } from "@/lib/api/engineers";
import { useApiResource } from "@/lib/api/useApiResource";

// Same floor as the project detail page (see the comment there) — the
// client's request form now collects budgetMin/budgetMax directly in MMK,
// so the raw value already IS the real amount; this just guards against an
// implausibly tiny display for older/seeded projects with a smaller raw
// value.
const MMK_FLOOR = 500_000;

function toMmk(value: number | string) {
  return Math.max(Math.round(Number(value)), MMK_FLOOR);
}

function formatBudget(min?: number | string, max?: number | string) {
  const format = (value: number | string) => `MMK ${toMmk(value).toLocaleString()}`;
  if (min != null && max != null) return `${format(min)} - ${format(max)}`;
  if (min != null) return `From ${format(min)}`;
  if (max != null) return `Up to ${format(max)}`;
  return null;
}

export default function EngineerMarketplacePage() {
  const { data: projects, loading, error, reload } = useApiResource(listOpenProjects, [], {
    pollMs: 30000,
  });
  // Which projects the engineer has already applied to — the actual apply
  // form now lives on the project's own detail page (see [id]/), this is
  // just enough to swap the card's button to a non-actionable "Applied" state.
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  // Seeded from ?q= so the header's global search box (which links here)
  // stays in sync with this page's own search box.
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  // No server-side project search exists for engineers, so this filters the
  // already-fetched open projects by title/description/location client-side.
  const visible = useMemo(() => {
    const list = projects ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((project) =>
      [project.title, project.description, project.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [projects, query]);

  useEffect(() => {
    let cancelled = false;
    listMyApplications()
      .then((applications) => {
        if (cancelled) return;
        setAppliedIds(new Set(applications.map((application) => application.projectId)));
      })
      .catch(() => {
        // Best-effort — projects will just show "Apply to Project" if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Engineer Marketplace</h1>
          <p className="mt-2 text-gray-600 italic">
            &quot;Discover active project requests submitted by verified clients.&quot;
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 border-2 border-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load projects from the server.</span>
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
        {visible.map((project) => {
          const applied = appliedIds.has(project.id);
          const budget = formatBudget(project.budgetMin, project.budgetMax);
          return (
            <article
              key={project.id}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
            >
              <ResourceImage
                resource="projects"
                id={project.id}
                alt={project.title}
                className="w-full h-40 object-cover border-b-4 border-black shrink-0"
                fallback={
                  <div className="w-full h-40 border-b-4 border-black shrink-0 bg-[#dbe6fb] flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-blue-900/40" />
                  </div>
                }
              />

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-sm uppercase leading-tight mb-2">{project.title}</h3>
                {project.location && (
                  <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </p>
                )}
                <p
                  className={`text-sm text-gray-600 flex-1 mb-1 ${
                    expandedId === project.id ? "" : "line-clamp-3"
                  }`}
                >
                  {project.description || "No description provided."}
                </p>
                {(project.description?.length ?? 0) > 140 && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((current) => (current === project.id ? null : project.id))
                    }
                    className="text-xs font-bold text-blue-600 hover:underline mb-3 text-left"
                  >
                    {expandedId === project.id ? "See less" : "See more"}
                  </button>
                )}
                {budget && <p className="text-xs font-bold uppercase mb-4">Budget: {budget}</p>}

                {applied ? (
                  <span className="block w-full border-2 border-black bg-[#86efac] py-2.5 text-xs font-bold uppercase text-center">
                    Applied
                  </span>
                ) : (
                  <Link
                    href={`/engineer/marketplace/${project.id}`}
                    className="block w-full border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] py-2.5 text-xs font-bold uppercase text-center transition-colors"
                  >
                    Apply to Project
                  </Link>
                )}
              </div>
            </article>
          );
        })}
        {!loading && visible.length === 0 && !error && (
          <p className="col-span-full text-center font-bold text-gray-500 py-12">
            {query ? "No projects match your search." : "No open projects right now."}
          </p>
        )}
      </div>
    </div>
  );
}
