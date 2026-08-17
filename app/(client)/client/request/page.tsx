"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { friendlyErrorMessage } from "@/lib/api/http";
import { createProject, type ProjectInput } from "@/lib/api/clients";
import { uploadResourceImage } from "@/lib/api/images";

// Matches the real specialization enum used everywhere else in the app
// (engineer profile, marketplace filters) — TU engineering fields only.
const categories = ["Civil", "Architect", "Mechanical", "Electrical"] as const;

// In Lakhs (1 Lakh = 100,000 MMK) — 500 Lakhs (50,000,000 MMK) is the floor,
// there's no tier below it.
const budgetRanges: Record<string, { min?: number; max?: number }> = {
  "500-1000": { min: 50_000_000, max: 100_000_000 },
  "1000-2500": { min: 100_000_000, max: 250_000_000 },
  "2500-plus": { min: 250_000_000 },
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

function ShadowBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border-2 border-zinc-900 shadow-[6px_6px_0_#18181b] ${className}`}>{children}</section>;
}

// Two fully independent requests, kept as two separate functions rather than
// interleaved in handleSubmit — deploying the request itself must succeed or
// fail on its own; attaching a cover photo is a second, unrelated request
// that a client may or may not have anything to send for, and whose failure
// should never look like (or actually cause) the request itself failing.
// The only thing tying them together is that the image request needs the id
// the deploy request returns, so it still has to run second.
function deployProjectRequest(input: ProjectInput) {
  return createProject(input);
}

// Doesn't throw — a failed image attach is reported back as a warning
// string for the caller to surface, not an exception, so it can never be
// mistaken for (or accidentally caught alongside) a failure of the deploy
// request above.
async function attachCoverImage(projectId: number, file: File): Promise<string | null> {
  try {
    await uploadResourceImage("projects", projectId, file);
    return null;
  } catch (error) {
    return friendlyErrorMessage(error, "The cover image couldn't be uploaded.");
  }
}

export default function RequestPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Civil");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [imageWarning, setImageWarning] = useState("");
  const [deploying, setDeploying] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function addFiles(nextFiles: FileList | null) {
    if (!nextFiles) return;
    setFiles((current) => [...current, ...Array.from(nextFiles)].slice(0, 5));
    setMessage("");
    setImageWarning("");
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  // Local object URLs so image files show an actual thumbnail instead of
  // just their filename — these are purely for previewing what was
  // selected before it's actually uploaded (see handleSubmit). Revoked on
  // every change so we don't leak blob URLs as files are added/removed.
  const previews = useMemo(
    () => files.map((file) => (file.type.startsWith("image/") ? URL.createObjectURL(file) : null)),
    [files]
  );
  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the form element now — React nulls out a synthetic event's
    // currentTarget once the synchronous dispatch finishes, so reading it
    // after the `await deployProjectRequest(...)` below would be null and throw.
    const formEl = event.currentTarget;
    setMessage("");
    setImageWarning("");
    setDeploying(true);
    try {
      const form = new FormData(formEl);
      const title = String(form.get("title") ?? "").trim();
      const scope = String(form.get("scope") ?? "").trim();
      const budgetKey = String(form.get("budget") ?? "");
      const { min, max } = budgetRanges[budgetKey] ?? {};
      const location = String(form.get("location") ?? "").trim();

      // The backend's project schema doesn't have deadline/category fields,
      // so category is folded into the description. assignmentType/visibility
      // ARE required though — a project only shows up in the engineer-facing
      // open feed and can only be applied to when both are set (verified live).
      const project = await deployProjectRequest({
        title,
        description: `[${category}] ${scope}`,
        assignmentType: "OPEN",
        visibility: "PUBLIC",
        ...(min != null ? { budgetMin: min } : {}),
        ...(max != null ? { budgetMax: max } : {}),
        ...(location ? { location } : {}),
      });

      // Reaching here means the request itself deployed successfully,
      // independent of anything below. The image endpoint (POST
      // /images/projects/{id}) only stores one image per project and only
      // accepts JPEG/PNG/WEBP up to 5MB (backend 413s above that — see
      // lib/api/images.ts), so of everything selected here only the first
      // image file, if under that limit, actually becomes the project's
      // cover photo. PDF/DWG/STEP files still have nowhere to be persisted
      // (there's no general attachment endpoint), so those stay
      // local-preview-only regardless of this step's outcome.
      const coverImage = files.find((file) => file.type.startsWith("image/"));
      if (coverImage) {
        const warning = await attachCoverImage(project.id, coverImage);
        if (warning) setImageWarning(warning);
      }

      setMessage("Request deployed. It's now live for engineers to review.");
      formEl.reset();
      setCategory("Civil");
      setFiles([]);
    } catch (error) {
      setMessage(friendlyErrorMessage(error, "Couldn't deploy this request. Please try again."));
    } finally {
      setDeploying(false);
    }
  }

  function saveDraft() {
    setMessage("Draft saved in this session.");
  }

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1400px]">
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono">
            <span className="inline-block border-2 border-zinc-900 bg-[#f4cf55] px-2 py-1 text-[10px] font-bold shadow-[2px_2px_0_#18181b]">SYSTEM INITIALIZATION</span>
            <p className="mt-2 text-[11px] font-bold">INITIALIZATION PROTOCOL</p>
            <h1 className="sr-only">Create a new engineering request</h1>
            <p className="mt-1 max-w-[590px] text-xs leading-5 text-zinc-600">Define your technical requirements. High-precision documentation ensures accelerated deployment and engineering alignment.</p>
          </div>
          <button type="button" onClick={saveDraft} className="self-start border-2 border-zinc-900 bg-white px-6 py-3 mt-16 font-mono text-[11px] font-bold shadow-[4px_4px_0_#18181b] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">SAVE AS DRAFT</button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)] xl:items-start">
          <ShadowBox className="p-5">
            <h2 className="border-b border-zinc-900 pb-2 text-xs font-medium">CORE PARAMETERS</h2>
            <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="title">PROJECT TITLE</label>
            <input id="title" name="title" required placeholder="E.G. MODULAR CHASSIS RE-ENGINEERING" className="mt-1 h-10 w-full border-2 border-zinc-800 bg-transparent px-3 font-mono text-xs outline-none focus:bg-blue-50" />

            <fieldset className="mt-4">
              <legend className="font-mono text-[9px] font-bold">PRIMARY CATEGORY</legend>
              <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {categories.map((item) => (
                  <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`h-9 border-2 border-zinc-800 font-mono text-[10px] uppercase ${category === item ? "bg-[#3973cf] text-white" : "bg-white hover:bg-zinc-100"}`}>{item}</button>
                ))}
              </div>
              <input type="hidden" name="category" value={category} />
            </fieldset>

            <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="scope">TECHNICAL REQUIREMENTS &amp; SCOPE</label>
            <textarea id="scope" name="scope" required rows={6} placeholder="DETAIL THE FUNCTIONAL AND NON-FUNCTIONAL REQUIREMENTS HERE..." className="mt-1 w-full resize-y border-2 border-zinc-800 bg-transparent p-3 font-mono text-xs leading-5 outline-none focus:bg-blue-50" />
          </ShadowBox>

          <ShadowBox className="bg-blue-400 p-5">
            <h2 className="border-b border-zinc-900 pb-2 text-xs font-medium">PROJECT CONSTRAINTS</h2>
            <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="deadline">TARGET DEADLINE</label>
            <input id="deadline" name="deadline" type="date" required className="mt-1 h-10 w-full border-2 border-zinc-800 bg-white px-3 font-mono text-xs outline-none" />
            <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="budget">BUDGET RANGE (LAKHS MMK)</label>
            <select id="budget" name="budget" defaultValue="500-1000" className="mt-1 h-10 w-full border-2 border-zinc-800 bg-white px-3 font-mono text-xs outline-none">
              <option value="500-1000">500 - 1,000 Lakhs</option><option value="1000-2500">1,000 - 2,500 Lakhs</option><option value="2500-plus">2,500+ Lakhs</option>
            </select>
            <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="location">LOCATION</label>
            <input id="location" name="location" placeholder="E.G. YANGON, MYANMAR" className="mt-1 h-10 w-full border-2 border-zinc-800 bg-white px-3 font-mono text-xs outline-none" />
          </ShadowBox>
        </div>

        <ShadowBox className="mt-6 p-5">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-2">
            <h2 className="text-xs font-medium">VISUAL DOCUMENTATION</h2>
            <span className="font-mono text-[8px] text-zinc-600">PDF, DWG, STEP, JPG/PNG/WEBP — COVER IMAGE MAX 5MB</span>
          </div>
          <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={() => fileInput.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && fileInput.current?.click()} className="mt-5 grid min-h-52 cursor-pointer place-items-center border-2 border-dashed border-zinc-900 bg-zinc-100 p-6 text-center outline-none hover:bg-blue-50 focus:bg-blue-50">
            <div>
              <span className="mx-auto grid size-12 place-items-center bg-zinc-900 text-white">
                <Icon><path d="M7 18H5V4h9l5 5v9h-2" /><path d="M14 4v5h5M12 20V11m-4 4 4-4 4 4" /></Icon>
              </span>
              <p className="mt-4 font-mono text-[11px] font-bold">DRAG &amp; DROP SCHEMATICS</p>
              <p className="font-mono text-[9px] text-zinc-500">OR CLICK TO BROWSE LOCAL DIRECTORY</p>
              {files.length > 0 && <p className="mt-3 font-mono text-[10px] text-[#2459b1]">{files.length} FILE{files.length === 1 ? "" : "S"} SELECTED</p>}
            </div>
            <input ref={fileInput} className="sr-only" type="file" multiple accept=".pdf,.dwg,.step,.stp,.jpg,.jpeg,.png,.webp" onChange={(event: ChangeEvent<HTMLInputElement>) => addFiles(event.target.files)} />
          </div>

          {files.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative border-2 border-zinc-900 bg-white p-1.5">
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                    className="absolute -right-2 -top-2 grid size-5 place-items-center border-2 border-zinc-900 bg-white text-zinc-900 hover:bg-red-100"
                  >
                    <Icon><path d="M6 6l12 12M18 6L6 18" /></Icon>
                  </button>
                  {previews[index] ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, next/image can't optimize it
                    <img src={previews[index]!} alt={file.name} className="h-20 w-full border border-zinc-300 object-cover" />
                  ) : (
                    <div className="grid h-20 w-full place-items-center border border-zinc-300 bg-zinc-100 text-zinc-500">
                      <Icon><path d="M7 18H5V4h9l5 5v9h-2" /><path d="M14 4v5h5M9 15l2-2 2 2 3-3" /></Icon>
                    </div>
                  )}
                  <p className="mt-1 truncate font-mono text-[8px] text-zinc-600">{file.name}</p>
                </div>
              ))}
            </div>
          )}
          {imageWarning && (
            <p className="mt-5 border-2 border-amber-600 bg-amber-50 p-3 font-mono text-[10px] font-bold text-amber-800">
              ⚠ {imageWarning}
            </p>
          )}
        </ShadowBox>

        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Link href="/client/dashboard" className="border-2 border-zinc-900 bg-white px-8 py-4 text-center font-mono text-[11px] font-bold shadow-[4px_4px_0_#18181b]">RETURN TO CONSOLE</Link>
          <button type="submit" disabled={deploying} className="border-2 border-zinc-900 bg-[#7ca3ef] px-12 py-4 font-mono text-[11px] font-bold shadow-[5px_5px_0_#18181b] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60">{deploying ? "DEPLOYING…" : "DEPLOY REQUEST"}</button>
        </div>
        <p aria-live="polite" className="mt-5 min-h-5 text-right font-mono text-[11px] font-bold text-[#2459b1]">{message}</p>
      </form>
    </div>
  );
}
