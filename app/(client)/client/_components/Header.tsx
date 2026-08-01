"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

const HIDDEN_ON = ["/client/request"];

export default function Header() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-1/2 pl-10 pr-4 py-1 border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 border-2 border-black overflow-hidden bg-blue-200 relative">
          <Image
            src="/profile.avif"
            alt="User avatar"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
