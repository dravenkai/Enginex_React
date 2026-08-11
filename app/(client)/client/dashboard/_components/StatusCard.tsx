import { Gauge } from "lucide-react";

export default function StatusCard() {
  return (
    <div className="bg-blue-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center h-full">
      <div className="bg-black text-white p-3 rounded-full mb-4">
        <Gauge className="w-8 h-8" />
      </div>
      <span className="text-md font-medium uppercase tracking-widest mb-1">
        System Status
      </span>
      <span className="text-base font-medium uppercase">Optimized</span>
    </div>
  );
}
