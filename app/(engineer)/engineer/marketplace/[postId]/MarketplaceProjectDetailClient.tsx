"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ClipboardList, RotateCw } from "lucide-react";
import ResourceImage from "@/components/ResourceImage";
import { applyToProject, listMyApplications, listOpenProjects } from "@/lib/api/engineers";
import { friendlyErrorMessage } from "@/lib/api/http";
import { useApiResource } from "@/lib/api/useApiResource";

// There's no submission-deadline field on the backend's Project schema —
// open projects just stay open until someone's accepted. This estimates one
// for display purposes only (doesn't gate applying) as postedDate + 4 weeks.
const DEADLINE_WEEKS_AFTER_POSTING = 4;

// The client's request form (see app/(client)/client/request/page.tsx) now
// collects budgetMin/budgetMax directly in MMK, with a 500,000-MMK floor
// (500 Lakhs) of its own — so the raw value here already IS the real MMK
// amount for anything created through that form. This floor is just a
// display-only safety net for the rare project with a smaller/legacy raw
// value (e.g. seeded test data), so it never reads as an implausibly tiny
// budget; it does NOT rescale real submissions.
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

// Same "[Category] rest..." unpacking used on the my-projects list/detail
// pages — see app/(client)/client/request/page.tsx for why the category
// isn't a real backend field.
function splitCategory(description?: string): { category: string | null; rest: string } {
  const match = description?.match(/^\[(\w+)\]\s*([\s\S]*)$/);
  if (match) return { category: match[1], rest: match[2] };
  return { category: null, rest: description ?? "" };
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MarketplaceProjectDetailClient({ id }: { id: string }) {
  const router = useRouter();
  // No GET /engineers/projects/open/{id} endpoint, so this reuses the list
  // (already fetched elsewhere via the same cache key) and picks the
  // matching project out of it — same approach as the my-projects detail
  // pages.
  const { data: projects, loading, error, reload } = useApiResource(listOpenProjects, [], {
    pollMs: 30000,
  });
  const project = useMemo(() => (projects ?? []).find((p) => String(p.id) === id), [projects, id]);
  const { category, rest } = splitCategory(project?.description);

  const [applied, setApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(true);
  useEffect(() => {
    let cancelled = false;
    listMyApplications()
      .then((applications) => {
        if (cancelled) return;
        setApplied(applications.some((application) => String(application.projectId) === id));
      })
      .catch(() => {
        // Best-effort — form just shows as not-yet-applied if this fails.
      })
      .finally(() => {
        if (!cancelled) setCheckingApplied(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const [weeks, setWeeks] = useState("");
  const [approach, setApproach] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const projectCreatedAt = project?.createdAt;
  // Both the deadline shown in the Apply panel and the "Target Timeline"
  // stat below are derived from the same two dates (posted, estimated
  // deadline) rather than just displaying DEADLINE_WEEKS_AFTER_POSTING
  // directly, so they stay in sync if that estimate ever changes.
  const { deadline, targetTimelineWeeks } = useMemo(() => {
    if (!projectCreatedAt) return { deadline: null, targetTimelineWeeks: null };
    const posted = new Date(projectCreatedAt);
    if (Number.isNaN(posted.getTime())) return { deadline: null, targetTimelineWeeks: null };
    const deadlineDate = new Date(posted);
    deadlineDate.setDate(deadlineDate.getDate() + DEADLINE_WEEKS_AFTER_POSTING * 7);
    const weeks = Math.round((deadlineDate.getTime() - posted.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return { deadline: formatDate(deadlineDate.toISOString()), targetTimelineWeeks: weeks };
  }, [projectCreatedAt]);

  const canSubmit = weeks.trim() !== "" && confirmed && !submitting;

  async function handleSubmit() {
    if (!project || !canSubmit) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const parts: string[] = [];
      if (weeks.trim()) parts.push(`Proposed timeline: ${weeks.trim()} week${weeks.trim() === "1" ? "" : "s"}`);
      if (approach.trim()) parts.push(approach.trim());
      await applyToProject(project.id, { message: parts.join("\n\n") || undefined });
      setApplied(true);
    } catch (err) {
      const message = friendlyErrorMessage(err);
      // The backend returns this as a 403 "error" when you've already
      // applied — that's not really a failure, so treat it as applied
      // instead of showing a red error (same handling as the listing page).
      if (/already applied/i.test(message)) {
        setApplied(true);
        return;
      }
      setSubmitError(message);
    } finally {
      setSubmitting(false);
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
          onClick={() => router.push("/engineer/marketplace")}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          &larr; Back to Marketplace
        </button>
      </div>
    );
  }

  const budget = formatBudget(project.budgetMin, project.budgetMax);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-6">
          <span className="inline-block bg-orange-400 text-white border-2 border-black px-3 py-1 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Project Case Study
          </span>

          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">{project.title}</h1>
            <p className="mt-1 text-blue-600 font-bold">
              {project.location ?? "Remote"} — Project #{project.id}
            </p>
          </div>

          <ResourceImage
            resource="projects"
            id={project.id}
            alt={project.title}
            className="w-full aspect-video object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            fallback={
              <div className="w-full aspect-video border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#dbe6fb] flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-blue-900/40" />
              </div>
            }
          />

          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            {category && (
              <span className="inline-block bg-[#fef08a] border-2 border-black px-2 py-1 text-xs font-bold">
                #{category}
              </span>
            )}

            <div>
              <h2 className="text-lg font-black uppercase underline decoration-2 underline-offset-4 mb-2">
                Project Brief
              </h2>
              <p className="text-sm text-gray-700 leading-6">{rest || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-black pt-6">
              <div className="border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Budget Range</p>
                <p className="text-xl font-black text-blue-600">{budget ?? "Not specified"}</p>
              </div>
              <div className="border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Target Timeline</p>
                <p className="text-xl font-black text-orange-600">
                  {targetTimelineWeeks != null ? `${targetTimelineWeeks} Weeks` : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 lg:sticky lg:top-24 space-y-5">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black uppercase">Apply for Project</h2>
          </div>
          {deadline && (
            <p className="text-xs text-gray-500 -mt-3">Estimated submission deadline: {deadline}</p>
          )}
          <div className="border-t-2 border-black" />

          {checkingApplied ? (
            <p className="text-sm text-gray-500">Checking application status…</p>
          ) : applied ? (
            <div className="bg-green-50 border-2 border-green-400 text-green-800 p-4 text-sm font-medium">
              You&apos;ve already applied to this project. The client will reach out if you&apos;re
              selected.
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Proposed Timeline (Weeks)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={weeks}
                    onChange={(event) => setWeeks(event.target.value)}
                    placeholder="e.g. 18"
                    className="w-full border-2 border-black px-3 py-2 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    WKS
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Technical Approach Summary
                </label>
                <textarea
                  value={approach}
                  onChange={(event) => setApproach(event.target.value)}
                  rows={4}
                  placeholder="Describe your methodology (Finite Element Analysis, Field Testing, etc.)"
                  className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <label className="flex items-start gap-2 bg-gray-50 border-2 border-black p-3 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0"
                />
                I confirm the timeline and approach above are accurate and I&apos;m able to take this
                project on.
              </label>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="w-full border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] disabled:opacity-50 py-3 font-bold text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
              {submitError && <p className="text-xs text-red-600 font-medium">{submitError}</p>}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
