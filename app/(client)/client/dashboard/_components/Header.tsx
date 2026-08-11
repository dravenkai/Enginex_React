"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, ArrowLeft } from "lucide-react";

const HIDDEN_ON = ["/client/request"];
const TITLES: Record<string, string> = {
  "/client/profile": "ACCOUNT",
  "/client/profile/edit": "ACCOUNT",
  "/client/my-projects": "MY PROJECTS",
  "/client/favorites": "FAVORITES",
};
const SEARCH_PLACEHOLDERS: Record<string, string> = {
  "/client/marketplace": "Search for engineers...",
};

function getMarketplaceBackHref(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  // ["client", "marketplace", slug] -> detail page; [..., slug, "assign"] -> back to detail page
  if (segments[0] !== "client" || segments[1] !== "marketplace" || segments.length < 3) {
    return null;
  }
  if (segments.length === 4 && segments[3] === "assign") {
    return `/${segments.slice(0, 3).join("/")}`;
  }
  if (segments.length === 3) {
    return "/client/marketplace";
  }
  return null;
}

export default function Header() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  const backHref = getMarketplaceBackHref(pathname);
  const title = TITLES[pathname];
  const searchPlaceholder = SEARCH_PLACEHOLDERS[pathname] ?? "Search projects...";

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 border-2 border-black bg-[#93c5fd] hover:bg-[#7ca3ef] px-4 py-2 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        ) : title ? (
          <h1 className="text-xl font-bold uppercase tracking-wide">{title}</h1>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-1/2 pl-10 pr-4 py-1 border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Notifications" className="p-2 hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <button aria-label="Settings" className="p-2 hover:bg-gray-100 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 border-2 border-black overflow-hidden bg-blue-200 relative">
          <Image
            src="/profile.avif"
            alt="User avatar"
            fill
            priority
            sizes="40px"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
