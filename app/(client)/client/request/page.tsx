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
  return <section className={`border-2 border-zinc-900 shadow-[6px_6px_0_#18181b] ${className}`}>{children}</section>;
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
    </div>
  );
}
