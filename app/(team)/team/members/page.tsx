"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, UserPlus, RotateCw } from "lucide-react";
import { listTeamMembers } from "@/lib/api/team";
import { useApiResource } from "@/lib/api/useApiResource";

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-[#86efac] text-black",
  BUSY: "bg-orange-400 text-white",
  ON_PROJECT: "bg-[#93c5fd] text-black",
};

export default function TeamMembersPage() {
  const [query, setQuery] = useState("");
  const { data: members, loading, error, reload } = useApiResource(listTeamMembers, []);

  const visible = useMemo(() => {
    const list = members ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((member) =>
      [member.engineer?.name, member.roleInTeam, String(member.engineerProfileId)]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [members, query]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Team Directory</h1>
          <p className="mt-2 text-gray-600">
            Manage member profiles, verify certifications, and manage team deployment.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search ID or Name"
              className="pl-9 pr-3 py-2.5 border-2 border-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black w-56"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-black font-bold text-xs uppercase bg-[#86efac] hover:bg-[#6fdb95] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Member
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load your team from the server: {error}</span>
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
        {visible.map((member) => {
          const status = member.engineer?.availabilityStatus ?? "AVAILABLE";
          return (
            <article
              key={member.id}
              className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <span
                className={`absolute top-4 right-4 border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyles[status] ?? statusStyles.AVAILABLE}`}
              >
                {status.replace("_", " ")}
              </span>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 border-2 border-black overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={member.engineer?.avatarUrl || "/profile.avif"}
                    alt={member.engineer?.name ?? "Team member"}
                    fill
                    unoptimized={Boolean(member.engineer?.avatarUrl)}
                    sizes="64px"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg leading-tight truncate">
                    {member.engineer?.name ?? `Engineer #${member.engineerProfileId}`}
                  </h3>
                  <p className="text-blue-600 text-sm font-bold">
                    {member.roleInTeam ?? member.engineer?.specialization ?? "Member"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">ID: {member.engineerProfileId}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t-2 border-black">
                {member.engineer?.specialization && (
                  <span className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase bg-gray-50">
                    {member.engineer.specialization}
                  </span>
                )}
                {member.approvalStatus && (
                  <span className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase bg-gray-50">
                    {member.approvalStatus}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="w-full border-2 border-black bg-white hover:bg-gray-100 py-2.5 font-bold text-xs uppercase transition-colors"
              >
                View Profile
              </button>
            </article>
          );
        })}

        <button
          type="button"
          className="border-2 border-dashed border-black bg-[#e5e9fb] hover:bg-[#d8dffa] flex flex-col items-center justify-center text-center p-8 min-h-[220px] transition-colors"
        >
          <UserPlus className="w-8 h-8 mb-4" />
          <p className="font-black text-lg">Onboard Member</p>
          <p className="text-sm text-gray-600 mt-2">Initialize new personnel file.</p>
        </button>

        {!loading && visible.length === 0 && !error && (
          <p className="col-span-full text-center font-bold text-gray-500 py-12">
            No members match your search.
          </p>
        )}
      </div>
    </div>
  );
}
