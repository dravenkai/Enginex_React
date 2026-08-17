"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AvatarImage from "@/components/AvatarImage";
import { CheckCircle2, FileText, Heart, RotateCw } from "lucide-react";
import { addFavorite, getEngineerPublicProfile, listFavorites, removeFavorite } from "@/lib/api/clients";
import { useApiResource } from "@/lib/api/useApiResource";
import { fallbackAvatar } from "@/lib/constants/avatars";

const specializationLabels: Record<string, string> = {
  CIVIL: "Civil Engineer",
  ARCHITECT: "Architect",
  MECHANICAL: "Mechanical Engineer",
  ELECTRICAL: "Electrical Engineer",
};

export default function EngineerDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const {
    data: engineer,
    loading,
    error,
    reload,
  } = useApiResource(() => getEngineerPublicProfile(id), [id]);

  const [saved, setSaved] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  // Seed the heart from the client's actual saved favorites, so an
  // already-favorited engineer shows a filled heart on load instead of
  // always starting blank.
  useEffect(() => {
    let cancelled = false;
    listFavorites()
      .then((favorites) => {
        if (!cancelled) setSaved(favorites.some((entry) => String(entry.engineerProfileId) === id));
      })
      .catch(() => {
        // Best-effort — the heart will just show as unsaved if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function toggleFavorite() {
    const wasSaved = saved;
    setSaved(!wasSaved);
    setFavoriteBusy(true);
    try {
      if (wasSaved) {
        await removeFavorite(id);
      } else {
        await addFavorite(Number(id));
      }
    } catch {
      // Revert the optimistic update if the call failed.
      setSaved(wasSaved);
    } finally {
      setFavoriteBusy(false);
    }
  }

  if (loading) {
    return <div className="p-8 max-w-[1400px] mx-auto text-sm text-gray-500">Loading engineer…</div>;
  }

  if (error || !engineer) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-4">
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>{error ?? "This engineer couldn't be found."}</span>
          <button
            type="button"
            onClick={reload}
            className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
        {/* router.back() returns to wherever the user actually came from
            (marketplace list, favorites, a project's applicants panel, ...)
            instead of always jumping to the generic marketplace listing. */}
        <button
          type="button"
          onClick={() => router.back()}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  const name = engineer.name ?? "Engineer";
  const role = engineer.specialization ? specializationLabels[engineer.specialization] : "Engineer";

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <section className="relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div
          className="absolute -right-6 -top-6 w-28 h-28 bg-[#dbe6fb] border-2 border-black rotate-12"
          aria-hidden
        />
        <div className="relative flex flex-col sm:flex-row gap-8">
          <div className="relative w-40 h-40 shrink-0 border-2 border-black overflow-hidden bg-gray-100">
            <AvatarImage
              src={engineer.avatarUrl}
              fallbackSrc={fallbackAvatar(id, engineer.name)}
              alt={name}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black">{name}</h1>
              {engineer.tuVerified && (
                <span className="px-2 py-1 text-[10px] font-bold uppercase bg-[#fef08a] text-black">
                  Verified Engineer
                </span>
              )}
            </div>
            <p className="text-blue-600 font-bold uppercase text-sm tracking-wide mt-1">{role}</p>

            <div className="flex flex-wrap gap-8 mt-5 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">Location</p>
                <p className="font-bold">{engineer.location || "Not set"}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-gray-500">Email</p>
                <p className="font-bold truncate">{engineer.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500">Projects</p>
                <p className="font-bold">{engineer.portfolios?.length ?? 0}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                href={`/client/marketplace/${id}/assign`}
                className="px-8 py-3 bg-[#93c5fd] hover:bg-[#7ca3ef] border-3 border-black font-bold text-sm uppercase transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                Request Service
              </Link>
              <button
                type="button"
                onClick={toggleFavorite}
                disabled={favoriteBusy}
                aria-label={saved ? "Remove from favorites" : "Add to favorites"}
                title={saved ? "Remove from favorites" : "Add to favorites"}
                className="w-20 h-12 border-3 border-black hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60"
              >
                <Heart className={`w-5 h-5 ${saved ? "fill-blue-500 text-blue-500" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-bold text-lg uppercase pb-3 mb-4 border-b-2 border-black">About</h2>
          <p className="text-sm text-gray-700 leading-6 break-words">
            {engineer.bio || "This engineer hasn't added a bio yet."}
          </p>
        </section>

        <div className="space-y-8">
          <section className="bg-[#dbe6fb] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase mb-4">Core Specs</h2>
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Primary Focus</p>
            <div className="bg-white border-2 border-black px-3 py-2 text-sm font-bold text-blue-600 mb-4">
              {role}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              {engineer.tuVerified ? "TU-Verified" : "Verification pending"}
            </div>
          </section>

          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase pb-3 mb-3 border-b-2 border-black">
              Availability
            </h2>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  engineer.availabilityStatus === "AVAILABLE" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {engineer.availabilityStatus
                ? engineer.availabilityStatus.replace("_", " ")
                : "Not specified"}
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg uppercase">Project Portfolio</h2>
        </div>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600 shrink-0" />
          {/* No confirmed way yet to fetch/open the actual PDFs (their real
              field names aren't confirmed against the live API — see
              lib/api/portfolio.ts) — this just reflects the count already
              returned on the engineer's profile. */}
          <p className="text-sm text-gray-700">
            {engineer.portfolios?.length
              ? `${engineer.portfolios.length} portfolio document${engineer.portfolios.length === 1 ? "" : "s"} on file.`
              : "No portfolio documents yet."}
          </p>
        </div>
      </section>
    </div>
  );
}
