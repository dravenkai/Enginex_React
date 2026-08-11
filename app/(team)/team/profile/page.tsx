"use client";

import Image from "next/image";
import { CheckCircle2, Globe, RotateCw } from "lucide-react";
import { getTeamProfile } from "@/lib/api/team";
import { useApiResource } from "@/lib/api/useApiResource";

const portfolio = [
  {
    title: "Valley Spire Bridge",
    year: "2022",
    description: "Structural reinforcement and modular concrete casting for a 2km span.",
    image: "https://picsum.photos/seed/valley-spire-bridge/640/420",
  },
  {
    title: "Sector 7 Arcology",
    year: "2020",
    description: "Foundation design and load distribution for high-density modular housing.",
    image: "https://picsum.photos/seed/sector-7-arcology/640/420",
  },
];

export default function TeamProfilePage() {
  const { data: profile, error, reload } = useApiResource(getTeamProfile, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load your team profile from the server: {error}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="relative aspect-[16/9] border-b-4 border-black">
              <Image
                src="https://picsum.photos/seed/apex-brutalist-building/1200/675"
                alt={profile?.companyName ?? "Team headquarters"}
                fill
                unoptimized
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover grayscale"
              />
            </div>
            <div className="p-8">
              <h1 className="text-4xl font-black">{profile?.companyName ?? "Your Company"}</h1>
              <p className="mt-3 text-gray-600 leading-6">
                {profile?.description || "No description yet."}
              </p>

              <div className="flex flex-wrap gap-10 mt-6 pt-6 border-t-2 border-black">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">HQ</p>
                  <p className="font-bold text-lg">{profile?.location || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">Website</p>
                  <p className="font-bold text-lg truncate max-w-[220px]">
                    {profile?.website || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">Status</p>
                  <p className="font-bold text-lg text-green-600">Active</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {portfolio.map((project) => (
              <article
                key={project.title}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
              >
                <div className="relative aspect-video border-b-4 border-black">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale"
                  />
                  <span className="absolute top-3 right-3 bg-white border-2 border-black px-2 py-0.5 text-[10px] font-bold">
                    {project.year}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-lg pb-3 mb-4 border-b-2 border-black">
              Specialized Fields
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Civil Engineering", "Infrastructure", "Seismic", "High-Rise", "Materials Science"].map(
                (field) => (
                  <span
                    key={field}
                    className={`border-2 border-black px-2 py-1 text-[10px] font-bold uppercase ${
                      field === "Seismic" ? "bg-[#93c5fd]" : "bg-gray-50"
                    }`}
                  >
                    {field}
                  </span>
                )
              )}
            </div>
          </section>

          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Verified Partner</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Certified Heavy Industries Partner. Cleared for Level 5 infrastructure projects
                  globally.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Global / Remote Capable</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Active deployment capabilities across 4 continents.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-lg mb-2">Engage Team</h2>
            <p className="text-sm text-gray-600 mb-5">
              Request deployment or consultation for active projects.
            </p>
            <button
              type="button"
              className="w-full border-2 border-black bg-[#86efac] hover:bg-[#6fdb95] py-3 font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mb-3"
            >
              Submit Request →
            </button>
            <button
              type="button"
              className="w-full border-2 border-black bg-white hover:bg-gray-100 py-3 font-bold text-xs uppercase transition-colors"
            >
              Download Dossier
            </button>
          </section>

          <section className="bg-[#fef08a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase underline decoration-2 underline-offset-4 mb-3">
              System Log
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>&gt; PROFILE_UPDATED: 24h ago</li>
              <li>&gt; CLEARANCE_RENEWED: Sector 4</li>
              <li>&gt; ACTIVE_NODE: YVR-01</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
