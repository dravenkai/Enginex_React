"use client";

import { Search, Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 border-2 border-black overflow-hidden bg-blue-200">
          {/* Placeholder for user avatar */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Khant"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
