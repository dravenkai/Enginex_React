"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AvatarImage from "@/components/AvatarImage";
import { FormEvent, useState } from "react";
import { RotateCw, ArrowRight } from "lucide-react";
import {
  createProject,
  deleteProject,
  getEngineerPublicProfile,
  listClientProjects,
  updateProject,
  type ClientProject,
} from "@/lib/api/clients";
import { useApiResource } from "@/lib/api/useApiResource";
import { friendlyErrorMessage } from "@/lib/api/http";
import { fallbackAvatar } from "@/lib/constants/avatars";

const specializationLabels: Record<string, string> = {
  CIVIL: "Civil Engineer",
  ARCHITECT: "Architect",
  MECHANICAL: "Mechanical Engineer",
  ELECTRICAL: "Electrical Engineer",
};

function formatBudget(min?: number | string, max?: number | string) {
  const format = (value: number | string) => `$${Number(value).toLocaleString()}`;
  if (min != null && max != null) return `${format(min)} - ${format(max)}`;
  if (min != null) return `From ${format(min)}`;
  if (max != null) return `Up to ${format(max)}`;
  return "Budget not set";
}

export default function AssignProjectClient({ id }: { id: string }) {
  const router = useRouter();
  const {
    data: engineer,
    loading,
    error,
    reload,
  } = useApiResource(() => getEngineerPublicProfile(id), [id]);

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    reload: reloadProjects,
  } = useApiResource(listClientProjects, []);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  if (loading) {
    return <div className="p-8 max-w-[1400px] mx-auto text-sm text-gray-500">Loading engineer…</div>;
  }

  if (error || !engineer) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-4">
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>{error ?? "This engineer couldn't be found."}</span>
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
          onClick={() => router.back()}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  const name = engineer.name ?? "Engineer";
  const role = engineer.specialization ? specializationLabels[engineer.specialization] : "Engineer";

  // Only OPEN projects have no engineer attached yet — ASSIGNED/IN_PROGRESS
  // ones already have one, and COMPLETED/CANCELLED aren't reassignable here.
  const assignableProjects = (projects ?? []).filter((project) => project.status === "OPEN");
  // "Active" for the sidebar summary = anything still in play, not just the
  // assignable subset above.
  const activeProjects = (projects ?? []).filter(
    (project) => project.status !== "COMPLETED" && project.status !== "CANCELLED"
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const source = assignableProjects.find((project) => String(project.id) === selectedProjectId);
    if (!source) return;
    setMessage("");
    setSending(true);

    let createdProjectId: number | null = null;
    try {
      // PATCHing the selected project's own assignmentType/status/visibility
      // to convert it in place was tried here before and turned out not to
      // actually reach the engineer's side — the backend appears not to
      // honor assignmentType changes via PATCH (or some combination of
      // these fields together), so the project just silently stayed OPEN.
      //
      // This instead reuses the *original*, backend-confirmed two-step direct
      // assignment: create a brand-new project as DIRECT from the start
      // (never PATCHed into that state), then assign the engineer via PATCH
      // with only selectedEngineerId — the one field/combination actually
      // verified to work. The new project's details are copied from the
      // existing request the client picked, so it still reads as "send this
      // request to this engineer" from the UI even though a fresh record is
      // created under the hood.
      const project = await createProject({
        title: source.title,
        description: source.description,
        assignmentType: "DIRECT",
        ...(source.location ? { location: source.location } : {}),
        ...(source.budgetMin != null ? { budgetMin: Number(source.budgetMin) } : {}),
        ...(source.budgetMax != null ? { budgetMax: Number(source.budgetMax) } : {}),
      });

      // Guard against a malformed/differently-shaped create response instead
      // of blindly PATCHing `/clients/projects/undefined` — that 404s with a
      // bare "Not Found" and, worse, leaves the just-created project behind
      // as an orphaned duplicate with no way to tell what went wrong.
      if (project?.id == null) {
        throw new Error("The project was created but didn't come back with an id. Please try again.");
      }
      createdProjectId = project.id;

      try {
        await updateProject(project.id, { selectedEngineerId: Number(id) });
      } catch {
        // A newly-created project occasionally 404s on an immediate follow-up
        // PATCH (backend read-after-write lag) — one short retry covers that
        // without treating every transient hiccup as a hard failure.
        await new Promise((resolve) => setTimeout(resolve, 800));
        await updateProject(project.id, { selectedEngineerId: Number(id) });
      }

      setMessage(
        `Request sent — this project is now assigned directly to ${name}. ` +
          `Your original request "${source.title}" is still open — cancel it from My Projects if you no longer need it.`
      );
      setSelectedProjectId("");
      reloadProjects();
    } catch (submitError) {
      // The assignment step never completed — clean up the orphaned project
      // this created rather than leaving a duplicate, unassigned copy behind
      // on every failed attempt.
      if (createdProjectId != null) {
        deleteProject(createdProjectId).catch(() => {
          // Best-effort cleanup — if even this fails, the duplicate has to be
          // removed manually from My Projects.
        });
      }
      setMessage(friendlyErrorMessage(submitError, "Couldn't submit this request. Please try again."));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black leading-tight uppercase">Assign Project to Engineer</h1>
            <p className="mt-2 text-sm text-gray-600">
              Detailed specification for engineer{" "}
              <Link href={`/client/marketplace/${id}`} className="text-blue-600 font-bold hover:underline">
                {name}
              </Link>{" "}
              ({role})
            </p>
          </section>

          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="border-2 border-black bg-[#faf5e6] p-6">
                <h2 className="font-black text-lg uppercase">Select Your Project</h2>

                {projectsError && (
                  <div className="mt-4 bg-red-50 border-2 border-red-400 text-red-700 p-3 text-xs font-medium flex items-center justify-between gap-4">
                    <span>Couldn&apos;t load your projects.</span>
                    <button
                      type="button"
                      onClick={reloadProjects}
                      className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-100"
                    >
                      <RotateCw className="w-3 h-3" />
                      Retry
                    </button>
                  </div>
                )}

                {!projectsLoading && !projectsError && assignableProjects.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-600">
                    You don&apos;t have any open requests to assign right now.{" "}
                    <Link href="/client/request" className="text-blue-600 font-bold hover:underline">
                      Create a new request
                    </Link>{" "}
                    first, then come back here to assign it to {name}.
                  </p>
                ) : (
                  <>
                    <select
                      value={selectedProjectId}
                      onChange={(event) => setSelectedProjectId(event.target.value)}
                      required
                      disabled={projectsLoading}
                      className="mt-4 w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
                    >
                      <option value="">
                        {projectsLoading ? "Loading your projects…" : "Choose an active project to assign"}
                      </option>
                      {assignableProjects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title} — {formatBudget(project.budgetMin, project.budgetMax)}
                        </option>
                      ))}
                    </select>
                    <p className="mt-3 text-xs text-gray-600">
                      Only your open requests are shown above — projects already assigned, completed, or
                      cancelled aren&apos;t eligible.
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t-2 border-black">
                <p className="text-xs text-gray-500 max-w-sm">
                  By submitting, you agree to the Enginex Master Service Agreement and data privacy
                  protocols.
                </p>
                <button
                  type="submit"
                  disabled={sending || !selectedProjectId}
                  className="border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-8 py-3 font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all shrink-0 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send Assignment Request"}
                </button>
              </div>
              {message && (
                <p aria-live="polite" className="text-sm font-medium text-right text-blue-700">
                  {message}
                </p>
              )}
            </form>
          </section>
        </div>

        <div className="space-y-8">
          <section className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="flex items-center justify-between gap-4 bg-[#9c8a1f] text-white px-5 py-4">
              <h2 className="font-black text-sm uppercase leading-tight">Existing Requests</h2>
              <span className="bg-white text-black border-2 border-black px-2 py-1 text-[10px] font-bold uppercase shrink-0">
                {activeProjects.length} Active
              </span>
            </div>
            <div className="bg-white p-5 space-y-3">
              <p className="text-xs text-gray-600">
                Reference current requests to avoid duplicates or link workflows.
              </p>
              {activeProjects.slice(0, 3).map((project: ClientProject) => (
                <Link
                  key={project.id}
                  href={`/client/my-projects/${project.id}`}
                  className="flex items-center justify-between gap-3 border-2 border-black bg-gray-100 hover:bg-gray-200 px-4 py-3 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-xs uppercase truncate">{project.title}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {project.status?.replace("_", " ") ?? "—"} · {formatBudget(project.budgetMin, project.budgetMax)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              ))}
              {!projectsLoading && activeProjects.length === 0 && (
                <p className="text-xs text-gray-500 border-2 border-dashed border-gray-300 p-3 text-center">
                  No requests yet.
                </p>
              )}
              <Link
                href="/client/my-projects"
                className="block border-2 border-dashed border-black px-4 py-2 text-center text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors"
              >
                View Full History
              </Link>
            </div>
          </section>

          <section className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="relative w-full aspect-[4/3] bg-gray-100">
              <AvatarImage
                src={engineer.avatarUrl}
                fallbackSrc={fallbackAvatar(id, engineer.name)}
                alt={name}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="bg-[#93c5fd] flex items-center gap-4 p-5">
              <div className="min-w-0">
                <p className="font-black text-sm uppercase truncate">{name}</p>
                <p className="text-[10px] font-bold uppercase text-black/70 leading-tight">{role}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
