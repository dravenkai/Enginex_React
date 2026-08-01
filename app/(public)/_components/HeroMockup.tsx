import { PenTool, Coffee, Calculator, NotebookPen, HardHat } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        className="absolute -left-6 top-4 hidden sm:flex items-center gap-2 bg-[#fef08a] border-4 border-black px-3 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-6"
        aria-hidden
      >
        <NotebookPen className="w-5 h-5" />
        <span className="font-bold text-xs uppercase">Blueprints</span>
      </div>

      <div
        className="absolute -right-4 top-0 hidden sm:flex items-center gap-2 bg-[#93c5fd] border-4 border-black px-3 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-6"
        aria-hidden
      >
        <PenTool className="w-5 h-5" />
        <span className="font-bold text-xs uppercase">Design</span>
      </div>

      <div className="bg-black p-2 pb-8 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)]">
        <div className="bg-white border-2 border-black aspect-video flex flex-col items-center justify-center gap-3 px-6">
          <div className="w-16 h-16 border-4 border-black bg-orange-100 flex items-center justify-center">
            <HardHat className="w-9 h-9" />
          </div>
          <div className="text-center">
            <p className="font-extrabold text-2xl sm:text-3xl tracking-tight">ENGINEX</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
              Engineering Community &amp; Construction Platform
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-40 bg-black rounded-b-xl" aria-hidden />

      <div
        className="absolute -bottom-2 -right-6 hidden sm:flex items-center gap-2 bg-orange-300 border-4 border-black px-3 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-3"
        aria-hidden
      >
        <Calculator className="w-5 h-5" />
      </div>

      <div
        className="absolute -bottom-4 -left-8 hidden sm:flex items-center gap-2 bg-white border-4 border-black px-3 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-3"
        aria-hidden
      >
        <Coffee className="w-5 h-5" />
      </div>
    </div>
  );
}
