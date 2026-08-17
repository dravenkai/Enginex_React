"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Rocket, UserPlus, X, RotateCw, Building2, MapPin, Globe } from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import { getTeamProfile, listTeamMembers, removeMember } from "@/lib/api/team";
import { useApiResource } from "@/lib/api/useApiResource";
import { fallbackAvatar } from "@/lib/constants/avatars";

const specializationLabels: Record<string, string> = {
  CIVIL: "Civil Engineer",
  ARCHITECT: "Architect",
  MECHANICAL: "Mechanical Engineer",
  ELECTRICAL: "Electrical Engineer",
};

export default function TeamOverviewPage() {
  const { data: profile } = useApiResource(getTeamProfile, []);
  const {
    data: members,
    loading: membersLoading,
    error: membersError,
    reload: reloadMembers,
  } = useApiResource(listTeamMembers, [], { pollMs: 30000 });

  // Approving/rejecting an invitation is the invited engineer's decision
  // (PATCH /team/members/{id}/decision is an ENGINEER-role endpoint per the
  // backend's own spec — a team account gets 403 calling it). The team's own
  // view of "pending" is just its member list filtered to that status, and
  // the only team-side action is to cancel/retract an invite.
  const teamSize = (members ?? []).filter((member) => member.approvalStatus === "APPROVED").length;
  const pending = useMemo(
    () => (members ?? []).filter((member) => member.approvalStatus === "PENDING"),
    [members]
  );

  const [cancelState, setCancelState] = useState<Record<number, "canceling" | "error">>({});

  async function handleCancel(memberId: number) {
    setCancelState((current) => ({ ...current, [memberId]: "canceling" }));
    try {
      await removeMember(memberId);
      reloadMembers();
    } catch {
      setCancelState((current) => ({ ...current, [memberId]: "error" }));
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <span className="inline-block border-2 border-black bg-[#4d4522] text-white px-3 py-1 text-xs font-bold uppercase">
          Team
        </span>
        <h1 className="text-4xl font-black mt-3">{profile?.companyName ?? "Your Company"}</h1>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-3">
          <p className="text-gray-600 max-w-xl leading-6">
            {profile?.description || "Add a description from your team profile."}
          </p>
          <div className="flex gap-8 shrink-0">
            <div className="pr-8 border-r-2 border-black">
              <p className="text-[10px] font-bold uppercase text-gray-500">Team Size</p>
              <p className="text-3xl font-black">{members ? teamSize : "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500">Pending Invites</p>
              <p className="text-3xl font-black">{members ? pending.length : "—"}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold">Project Opportunities</h2>
              </div>
              <Link
                href="/team/marketplace"
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Browse All Requests
              </Link>
            </div>
            {/* No backend endpoint exists yet to list open project requests for
                teams to browse — showing an honest empty state instead of
                fabricated opportunities. */}
            <p className="text-sm text-gray-500 border-2 border-dashed border-gray-300 p-6 text-center">
              No open opportunities to show yet.
            </p>
          </section>

          <section className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="flex items-center justify-between bg-black text-white px-6 py-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <h2 className="font-bold text-sm uppercase">Recruitment Hub</h2>
              </div>
              <span className="border-2 border-white/40 bg-[#93c5fd] text-black px-2 py-1 text-[10px] font-bold">
                {pending.length} Pending
              </span>
            </div>

            {membersError && (
              <div className="bg-red-50 border-b-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
                <span>Couldn&apos;t load invitations: {membersError}</span>
                <button
                  type="button"
                  onClick={reloadMembers}
                  className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            <div className="bg-white divide-y-2 divide-black">
              {pending.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-5">
                  <div className="relative w-11 h-11 border-2 border-black overflow-hidden shrink-0 bg-gray-100">
                    <AvatarImage
                      src={member.engineer?.avatarUrl}
                      fallbackSrc={fallbackAvatar(member.engineerProfileId, member.engineer?.name)}
                      alt={member.engineer?.name ?? "Engineer"}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">
                      {member.engineer?.name ?? `Engineer #${member.engineerProfileId}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.roleInTeam ??
                        (member.engineer?.specialization
                          ? specializationLabels[member.engineer.specialization]
                          : "Member")}
                      {member.engineer?.yearsOfExperience != null
                        ? ` • ${member.engineer.yearsOfExperience} Yrs Exp`
                        : ""}
                      {member.engineer?.location ? ` • ${member.engineer.location}` : ""}
                    </p>
                    {cancelState[member.id] === "error" && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        Couldn&apos;t cancel this invite. Try again.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={cancelState[member.id] === "canceling"}
                      onClick={() => handleCancel(member.id)}
                      aria-label={`Cancel invite to ${member.engineer?.name ?? "engineer"}`}
                      title="Cancel invite — accepting/rejecting is the engineer's own decision"
                      className="w-9 h-9 border-2 border-black bg-red-100 hover:bg-red-200 flex items-center justify-center disabled:opacity-60"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              {!membersLoading && pending.length === 0 && !membersError && (
                <p className="text-sm text-gray-500 p-6 text-center">No pending invitations.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="h-24 bg-[#dbe6fb] border-b-4 border-black flex items-center justify-center">
              <Building2 className="w-10 h-10 text-blue-900/40" />
            </div>
            <div className="p-6">
              <h3 className="font-black text-xl leading-tight">
                {profile?.companyName ?? "Your Company"}
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-6">
                {profile?.description || "No description yet."}
              </p>

              {(profile?.location || profile?.website) && (
                <div className="border-t-2 border-black pt-4 mt-4 space-y-2 text-sm text-gray-600">
                  {profile?.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {profile.location}
                    </p>
                  )}
                  {profile?.website && (
                    <p className="flex items-center gap-2 truncate">
                      <Globe className="w-4 h-4 shrink-0" />
                      {profile.website}
                    </p>
                  )}
                </div>
              )}

              <Link
                href="/team/profile"
                className="mt-6 w-full flex items-center justify-center gap-2 border-2 border-black bg-black text-white hover:bg-gray-900 py-3 font-bold text-xs uppercase transition-colors"
              >
                View Public Profile
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
