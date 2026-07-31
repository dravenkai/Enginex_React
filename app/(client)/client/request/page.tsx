"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useRef, useState } from "react";

const categories = ["Software", "Mechanical", "Electrical", "Others"] as const;

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

function ShadowBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border-2 border-zinc-900 bg-white shadow-[6px_6px_0_#18181b] ${className}`}>{children}</section>;
}

export default function RequestPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Software");
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function addFiles(nextFiles: FileList | null) {
    if (!nextFiles) return;
    setFiles((current) => [...current, ...Array.from(nextFiles)].slice(0, 5));
    setMessage("");
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Request ready for deployment.");
  }

  function saveDraft() {
    setMessage("Draft saved in this session.");
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-900 lg:grid lg:grid-cols-[190px_1fr]">
      <aside className="border-b-2 border-zinc-900 bg-white px-5 py-5 lg:fixed lg:inset-y-0 lg:w-[190px] lg:border-b-0 lg:border-r-2">
        <div className="flex items-center justify-between lg:block">
          <Link href="/client/home" className="inline-flex items-center gap-2" aria-label="Enginex home">
            <span className="grid size-9 place-items-center bg-[#7ca3ef] text-lg font-black shadow-[3px_3px_0_#f4cf55]">E</span>
            <span>
              <strong className="block text-lg leading-none">Enginex</strong>
              <small className="font-mono text-[9px] tracking-[0.18em] text-zinc-500">CLIENT SITE</small>
            </span>
          </Link>
          <span className="border border-zinc-900 bg-[#f4cf55] px-2 py-1 font-mono text-[9px] lg:hidden">NEW REQUEST</span>
        </div>

        <nav className="mt-5 grid grid-cols-4 gap-2 font-mono text-[11px] text-zinc-600 lg:mt-16 lg:block lg:space-y-7 lg:text-xs">
          <Link href="/client/dashboard" className="flex flex-col items-center gap-2 hover:text-zinc-950 lg:flex-row lg:gap-4">
            <Icon><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon> Dashboard
          </Link>
          <Link href="/client/marketplace" className="flex flex-col items-center gap-2 hover:text-zinc-950 lg:flex-row lg:gap-4">
            <Icon><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v10h14V9M9 4v5m6-5v5" /></Icon> Marketplace
          </Link>
          <Link href="#" className="flex flex-col items-center gap-2 hover:text-zinc-950 lg:flex-row lg:gap-4">
            <Icon><path d="M12 20S4 15.3 4 9.5A4.5 4.5 0 0 1 12 6.7a4.5 4.5 0 0 1 8 2.8C20 15.3 12 20 12 20Z" /></Icon> Favorites
          </Link>
          <Link href="/client/profile" className="flex flex-col items-center gap-2 hover:text-zinc-950 lg:flex-row lg:gap-4">
            <Icon><circle cx="12" cy="8" r="3" /><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" /></Icon> Profile
          </Link>
        </nav>

        <Link href="/client/request" aria-current="page" className="mt-8 hidden border-2 border-zinc-900 bg-[#7ca3ef] px-4 py-3 text-center font-mono text-[11px] font-bold tracking-wider shadow-[4px_4px_0_#18181b] lg:absolute lg:bottom-8 lg:left-5 lg:block lg:w-[148px]">
          NEW REQUEST
        </Link>
      </aside>

      <main className="px-5 py-8 sm:px-8 lg:col-start-2 lg:px-10 lg:py-9 xl:px-14">
        <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px]">
          <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-mono">
              <span className="inline-block border-2 border-zinc-900 bg-[#f4cf55] px-2 py-1 text-[10px] font-bold shadow-[2px_2px_0_#18181b]">SYSTEM INITIALIZATION</span>
              <p className="mt-2 text-[11px] font-bold">INITIALIZATION PROTOCOL</p>
              <h1 className="sr-only">Create a new engineering request</h1>
              <p className="mt-1 max-w-[590px] text-xs leading-5 text-zinc-600">Define your technical requirements. High-precision documentation ensures accelerated deployment and engineering alignment.</p>
            </div>
            <button type="button" onClick={saveDraft} className="self-start border-2 border-zinc-900 bg-white px-6 py-3 font-mono text-[11px] font-bold shadow-[4px_4px_0_#18181b] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">SAVE AS DRAFT</button>
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

            <ShadowBox className="bg-[#7ca3ef] p-5">
              <h2 className="border-b border-zinc-900 pb-2 text-xs font-medium">PROJECT CONSTRAINTS</h2>
              <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="deadline">TARGET DEADLINE</label>
              <input id="deadline" name="deadline" type="date" required className="mt-1 h-10 w-full border-2 border-zinc-800 bg-white px-3 font-mono text-xs outline-none" />
              <label className="mt-4 block font-mono text-[9px] font-bold" htmlFor="budget">BUDGET RANGE (USD)</label>
              <select id="budget" name="budget" defaultValue="5-10" className="mt-1 h-10 w-full border-2 border-zinc-800 bg-white px-3 font-mono text-xs outline-none">
                <option value="under-5">Under $5k</option><option value="5-10">$5k - $10k</option><option value="10-25">$10k - $25k</option><option value="25-plus">$25k+</option>
              </select>
            </ShadowBox>
          </div>

          <ShadowBox className="mt-6 p-5">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-2">
              <h2 className="text-xs font-medium">VISUAL DOCUMENTATION</h2>
              <span className="font-mono text-[8px] text-zinc-600">PDF, DWG, STEP, JPG (MAX 50MB)</span>
            </div>
            <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={() => fileInput.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && fileInput.current?.click()} className="mt-5 grid min-h-52 cursor-pointer place-items-center border-2 border-dashed border-zinc-900 bg-zinc-100 p-6 text-center outline-none hover:bg-blue-50 focus:bg-blue-50">
              <div>
                <span className="mx-auto grid size-12 place-items-center bg-zinc-900 text-white">
                  <Icon><path d="M7 18H5V4h9l5 5v9h-2" /><path d="M14 4v5h5M12 20V11m-4 4 4-4 4 4" /></Icon>
                </span>
                <p className="mt-4 font-mono text-[11px] font-bold">DRAG &amp; DROP SCHEMATICS</p>
                <p className="font-mono text-[9px] text-zinc-500">OR CLICK TO BROWSE LOCAL DIRECTORY</p>
                {files.length > 0 && <p className="mt-3 font-mono text-[10px] text-[#2459b1]">{files.map((file) => file.name).join(" · ")}</p>}
              </div>
              <input ref={fileInput} className="sr-only" type="file" multiple accept=".pdf,.dwg,.step,.stp,.jpg,.jpeg" onChange={(event: ChangeEvent<HTMLInputElement>) => addFiles(event.target.files)} />
            </div>
          </ShadowBox>

          <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
            <Link href="/client/dashboard" className="border-2 border-zinc-900 bg-white px-8 py-4 text-center font-mono text-[11px] font-bold shadow-[4px_4px_0_#18181b]">RETURN TO CONSOLE</Link>
            <button type="submit" className="border-2 border-zinc-900 bg-[#7ca3ef] px-12 py-4 font-mono text-[11px] font-bold shadow-[5px_5px_0_#18181b] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none">DEPLOY REQUEST</button>
          </div>
          <p aria-live="polite" className="mt-5 min-h-5 text-right font-mono text-[11px] font-bold text-[#2459b1]">{message}</p>
        </form>
      </main>
    </div>
  );
}
