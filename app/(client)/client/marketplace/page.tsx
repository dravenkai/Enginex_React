"use client";

import Link from "next/link";
import AvatarImage from "@/components/AvatarImage";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Heart, RotateCw, Search } from "lucide-react";
import {
  addFavorite,
  listFavorites,
  removeFavorite,
  searchEngineers,
  type EngineerSearchResult,
} from "@/lib/api/clients";
import { useApiResource } from "@/lib/api/useApiResource";
import { fallbackAvatar } from "@/lib/constants/avatars";

type Filter = "All" | EngineerSearchResult["specialization"];

const filters: { value: Filter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "CIVIL", label: "Civil" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "MECHANICAL", label: "Mechanical" },
  { value: "ELECTRICAL", label: "Electrical" },
];

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("All");
  // Seeded from ?q= so the header's global search box (which links here) and
  // this page's own search box stay in sync instead of being two disconnected
  // search boxes on the same screen.
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [saved, setSaved] = useState<number[]>([]);

  const {
    data: results,
    loading,
    error,
    reload,
  } = useApiResource(() => searchEngineers(query), [query]);

  // Seed the heart state from the client's actual saved favorites, so
  // already-favorited engineers show a filled heart on load instead of
  // always starting blank.
  useEffect(() => {
    let cancelled = false;
    listFavorites()
      .then((favorites) => {
        if (!cancelled) setSaved(favorites.map((entry) => entry.engineerProfileId));
      })
      .catch(() => {
        // Best-effort — favorites will just show as unsaved if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const list = results ?? [];
    if (filter === "All") return list;
    return list.filter((engineer) => engineer.specialization === filter);
  }, [results, filter]);

  async function toggleFavorite(engineer: EngineerSearchResult) {
    const isSaved = saved.includes(engineer.id);
    setSaved((current) =>
      isSaved ? current.filter((id) => id !== engineer.id) : [...current, engineer.id]
    );
    try {
      if (isSaved) {
        await removeFavorite(engineer.id);
      } else {
        await addFavorite(engineer.id);
      }
    } catch {
      // Revert the optimistic update if the call failed.
      setSaved((current) =>
        isSaved ? [...current, engineer.id] : current.filter((id) => id !== engineer.id)
      );
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black">Engineer Marketplace</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Find world-class technical talent for your next project. Verified experts in civil,
          architecture, mechanical, and electrical engineering ready to build.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase transition-all ${
                filter === item.value
                  ? "bg-[#93c5fd] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search engineers..."
            className="w-full pl-9 pr-3 py-2 border-2 border-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load engineers from the server.</span>
          <button
            type="button"
            onClick={reload}
            className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((engineer) => (
          <article
            key={engineer.id}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-24 h-24 border-2 border-black overflow-hidden bg-gray-100">
                  <AvatarImage
                    src={engineer.avatarUrl}
                    fallbackSrc={fallbackAvatar(engineer.id, engineer.name)}
                    alt={engineer.name ?? "Engineer"}
                    fill
                    sizes="96px"
                    className="object-cover grayscale"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(engineer)}
                  aria-label={saved.includes(engineer.id) ? "Remove from favorites" : "Add to favorites"}
                  title={saved.includes(engineer.id) ? "Remove from favorites" : "Add to favorites"}
                  className="w-9 h-9 border-2 border-black hover:bg-gray-100 flex items-center justify-center shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      saved.includes(engineer.id) ? "fill-blue-500 text-blue-500" : ""
                    }`}
                  />
                </button>
              </div>

              <h3 className="font-bold text-xl leading-tight">{engineer.name ?? "Engineer"}</h3>
              <p className="text-gray-600 mt-1">
                {engineer.specialization ?? "—"}
                {engineer.yearsOfExperience != null ? ` · ${engineer.yearsOfExperience} yrs` : ""}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 text-[10px] font-bold uppercase">
                {engineer.location && (
                  <span className="border-2 border-black px-2 py-1 bg-gray-50">
                    {engineer.location}
                  </span>
                )}
                {engineer.hourlyRate != null && (
                  <span className="border-2 border-black px-2 py-1 bg-[#fef08a]">
                    ${engineer.hourlyRate}/hr
                  </span>
                )}
                {engineer.availabilityStatus && (
                  <span className="border-2 border-black px-2 py-1 bg-white">
                    {engineer.availabilityStatus.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t-2 border-black">
              <Link
                href={`/client/marketplace/${engineer.id}/assign`}
                className="flex-1 py-3 bg-[#fef08a] hover:bg-[#f5e35a] border-2 border-black font-bold text-xs uppercase text-center transition-colors"
              >
                Request Service
              </Link>
              <Link
                href={`/client/marketplace/${engineer.id}`}
                className="flex-1 py-3 bg-white hover:bg-gray-100 border-2 border-black font-bold text-xs uppercase text-center transition-colors"
              >
                View Profile
              </Link>
            </div>
          </article>
        ))}
        {!loading && visible.length === 0 && !error && (
          <p className="col-span-full text-center font-bold text-gray-500 py-12">
            No engineers match these filters.
          </p>
        )}
      </div>
    </div>
  );
}
