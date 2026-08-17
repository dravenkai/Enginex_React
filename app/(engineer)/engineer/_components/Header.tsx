"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Search, Settings, ArrowLeft } from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import { getEngineerProfile } from "@/lib/api/engineers";
import { profileImageUrl } from "@/lib/api/profileImage";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";
import { fallbackAvatar } from "@/lib/constants/avatars";
import NotificationBell from "./NotificationBell";

const TITLES: Record<string, string> = {
  "/engineer/profile": "ACCOUNT",
  "/engineer/profile/edit": "ACCOUNT",
  "/engineer/my-projects": "MY PROJECTS",
  // The marketplace page has its own working project search in the page
  // body — a second, disconnected search box here would just duplicate it.
  "/engineer/marketplace": "MARKETPLACE",
};

// Detail-style routes get a "Back" control instead of the search box/title.
// It navigates via router.back() rather than a fixed href, so it returns to
// wherever the user actually came from instead of always the listing page.
function isDetailRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "engineer" && segments[1] === "marketplace" && segments.length >= 3;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const { data: profile } = useApiResource(getEngineerProfile, []);
  const user = useAuthStore((state) => state.user);
  const showBack = isDetailRoute(pathname);
  const title = TITLES[pathname];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/engineer/marketplace?q=${encodeURIComponent(q)}` : "/engineer/marketplace");
  }

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-4 py-2 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : title ? (
          <h1 className="text-xl font-bold uppercase tracking-wide">{title}</h1>
        ) : (
          <form onSubmit={handleSearch} className="relative">
            <button
              type="submit"
              aria-label="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <Search className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search projects..."
              className="w-1/2 pl-10 pr-4 py-1 border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </form>
        )}
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        {showBack && (
          <button aria-label="Settings" className="p-2 hover:bg-gray-100 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        )}
        <Link
          href="/engineer/profile"
          aria-label="Your profile"
          className="w-10 h-10 border-2 border-black overflow-hidden bg-blue-200 relative block"
        >
          <AvatarImage
            src={user?.id ? profileImageUrl(user.id) : null}
            fallbackSrc={fallbackAvatar(profile?.id, profile?.name)}
            alt="Your profile"
            fill
            priority
            sizes="40px"
            className="object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
