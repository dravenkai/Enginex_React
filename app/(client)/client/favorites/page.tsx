"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, RotateCw, Heart, Plus } from "lucide-react";
import { listFavorites } from "@/lib/api/clients";
import { useApiResource } from "@/lib/api/useApiResource";

export default function FavoritesPage() {
  const [query, setQuery] = useState("");
  const { data: favorites, loading, error, reload } = useApiResource(listFavorites, []);

  const visible = useMemo(() => {
    const list = favorites ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((entry) => (entry.engineer?.name ?? "").toLowerCase().includes(needle));
  }, [favorites, query]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-black">Saved Favorites</h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "Loading…" : `${visible.length} favorite${visible.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search favorites..."
            className="w-full pl-9 pr-3 py-2 border-2 border-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load your favorites from the server: {error}</span>
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
        {visible.map((entry) => (
          <article
            key={entry.id}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
          >
            <div className="relative aspect-[4/3] border-b-4 border-black bg-gray-100">
              <Image
                src={entry.engineer?.avatarUrl || "/profile.avif"}
                alt={entry.engineer?.name ?? "Engineer"}
                fill
                unoptimized={Boolean(entry.engineer?.avatarUrl)}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="absolute top-3 right-3 w-8 h-8 border-2 border-black bg-white flex items-center justify-center">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-base leading-tight">
                {entry.engineer?.name ?? `Engineer #${entry.engineerProfileId}`}
              </h4>
              <p className="text-sm text-gray-600 mt-1 mb-6 flex-1">
                {entry.engineer?.specialization ?? ""}
                {entry.engineer?.location ? ` · ${entry.engineer.location}` : ""}
              </p>

              <Link
                href={`/client/marketplace/${entry.engineerProfileId}`}
                className="w-full py-2 bg-[#93c5fd] border-2 border-black font-bold text-xs uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                View Profile
              </Link>
            </div>
          </article>
        ))}

        <Link
          href="/client/marketplace"
          className="border-2 border-dashed border-gray-400 hover:border-black flex flex-col items-center justify-center text-center p-8 min-h-[280px] transition-colors"
        >
          <span className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center mb-4">
            <Plus className="w-5 h-5" />
          </span>
          <p className="font-bold text-sm uppercase tracking-wide">Browse Marketplace</p>
          <p className="text-xs text-gray-500 mt-2 max-w-[180px]">
            Discover more engineers to add to your favorites.
          </p>
        </Link>

        {!loading && visible.length === 0 && !error && (
          <p className="col-span-full text-center font-bold text-gray-500 py-12">
            No favorites match your search.
          </p>
        )}
      </div>
    </div>
  );
}
