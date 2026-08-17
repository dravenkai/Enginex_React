"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Search, Settings, ArrowLeft } from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import { profileImageUrl } from "@/lib/api/profileImage";
import { useAuthStore } from "@/lib/auth/store";
import NotificationBell from "./NotificationBell";

const HIDDEN_ON = ["/client/request"];
const TITLES: Record<string, string> = {
  "/client/profile": "ACCOUNT",
  "/client/profile/edit": "ACCOUNT",
  "/client/my-projects": "MY PROJECTS",
  "/client/favorites": "FAVORITES",
  // The marketplace page already has its own working engineer search in the
  // page body — showing a second, disconnected search box here would just be
  // a confusing duplicate, so this shows a plain title there instead.
  "/client/marketplace": "MARKETPLACE",
};

// Detail-style routes (engineer profile, assign flow, project detail) get a
// "Back" control instead of the search box/title. It navigates via
// router.back() rather than a fixed href, so it returns to wherever the user
// actually came from (marketplace list, favorites, dashboard, a project's
// applicants panel, ...) instead of always jumping to the same fixed page.
function isDetailRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // /client/marketplace/[slug], /client/marketplace/[slug]/assign
  if (segments[0] === "client" && segments[1] === "marketplace" && segments.length >= 3) {
    return true;
  }
  // /client/my-projects/[id]
  if (segments[0] === "client" && segments[1] === "my-projects" && segments.length === 3) {
    return true;
  }
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const user = useAuthStore((state) => state.user);

  if (HIDDEN_ON.includes(pathname)) return null;

  const showBack = isDetailRoute(pathname);
  const title = TITLES[pathname];

  // Links into an engineer's profile from a project's applicants panel tag
  // themselves with ?from=project&projectId=..., so "Back" here returns
  // straight to that project instead of a generic history pop.
  const fromProjectId = searchParams.get("from") === "project" ? searchParams.get("projectId") : null;

  function handleBack() {
    if (fromProjectId) {
      router.push(`/client/my-projects/${fromProjectId}`);
    } else {
      router.back();
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/client/marketplace?q=${encodeURIComponent(q)}` : "/client/marketplace");
  }

  return (
    <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 border-2 border-black bg-[#93c5fd] hover:bg-[#7ca3ef] px-4 py-2 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {fromProjectId ? "Back to Project" : "Back"}
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
              placeholder="Search for engineers..."
              className="w-1/2 pl-10 pr-4 py-1 border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </form>
        )}
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <button aria-label="Settings" className="p-2 hover:bg-gray-100 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <Link
          href="/client/profile"
          aria-label="Your profile"
          className="w-10 h-10 border-2 border-black overflow-hidden bg-blue-200 relative block"
        >
          <AvatarImage
            src={user?.id ? profileImageUrl(user.id) : null}
            fallbackSrc="/profile.avif"
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
