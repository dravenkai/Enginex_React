"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, UserPlus, RotateCw, X } from "lucide-react";
import { inviteMember, listTeamMembers, removeMember, type TeamMemberEntry } from "@/lib/api/team";
import { useApiResource } from "@/lib/api/useApiResource";
import { friendlyErrorMessage } from "@/lib/api/http";
import { fallbackAvatar } from "@/lib/constants/avatars";
import AvatarImage from "@/components/AvatarImage";

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-[#86efac] text-black",
  BUSY: "bg-orange-400 text-white",
  ON_PROJECT: "bg-[#93c5fd] text-black",
};

export default function TeamMembersPage() {
  const [query, setQuery] = useState("");
  const { data: members, loading, error, reload } = useApiResource(listTeamMembers, [], {
    pollMs: 30000,
  });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [removeState, setRemoveState] = useState<Record<number, "confirming" | "removing" | "error">>(
    {}
  );
  const [viewing, setViewing] = useState<TeamMemberEntry | null>(null);

  // Native window.confirm() is unreliable across browsers/embedded webviews
  // (can be silently blocked) and looks out of place in this custom UI, so
  // this uses an in-page confirm step instead: first click arms it, second
  // click within the same render actually removes.
  async function handleRemove(member: { id: number; engineer?: { name?: string } }) {
    if (removeState[member.id] !== "confirming") {
      setRemoveState((current) => ({ ...current, [member.id]: "confirming" }));
      return;
    }
    setRemoveState((current) => ({ ...current, [member.id]: "removing" }));
    try {
      await removeMember(member.id);
      reload();
    } catch {
      setRemoveState((current) => ({ ...current, [member.id]: "error" }));
    }
  }

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setInviteError("");
    setInviting(true);
    try {
      const form = new FormData(formEl);
      const engineerProfileId = Number(form.get("engineerProfileId"));
      const roleInTeam = String(form.get("roleInTeam") ?? "").trim();
      if (!Number.isInteger(engineerProfileId) || engineerProfileId < 1) {
        throw new Error("Enter a valid engineer profile ID.");
      }
      await inviteMember({ engineerProfileId, ...(roleInTeam ? { roleInTeam } : {}) });
      setInviteOpen(false);
      formEl.reset();
      reload();
    } catch (err) {
      setInviteError(friendlyErrorMessage(err, "Couldn't send this invite. Please try again."));
    } finally {
      setInviting(false);
    }
  }

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
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-black font-bold text-xs uppercase bg-[#86efac] hover:bg-[#6fdb95] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Member
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load your team from the server.</span>
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
                  <AvatarImage
                    src={member.engineer?.avatarUrl}
                    fallbackSrc={fallbackAvatar(member.engineerProfileId, member.engineer?.name)}
                    alt={member.engineer?.name ?? "Team member"}
                    fill
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

              {removeState[member.id] === "error" && (
                <p className="text-xs text-red-600 font-medium mb-2">
                  Couldn&apos;t remove this member. Try again.
                </p>
              )}
              <div className="flex gap-2">
                {removeState[member.id] === "confirming" ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setRemoveState((current) => {
                          const next = { ...current };
                          delete next[member.id];
                          return next;
                        })
                      }
                      className="flex-1 border-2 border-black bg-white hover:bg-gray-100 py-2.5 font-bold text-xs uppercase transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(member)}
                      className="flex-1 border-2 border-black bg-red-600 hover:bg-red-700 text-white py-2.5 font-bold text-xs uppercase transition-colors"
                    >
                      Confirm Remove
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setViewing(member)}
                      className="flex-1 border-2 border-black bg-white hover:bg-gray-100 py-2.5 font-bold text-xs uppercase transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      disabled={removeState[member.id] === "removing"}
                      onClick={() => handleRemove(member)}
                      className="flex-1 border-2 border-black bg-red-100 hover:bg-red-200 text-red-700 py-2.5 font-bold text-xs uppercase transition-colors disabled:opacity-60"
                    >
                      {removeState[member.id] === "removing" ? "Removing…" : "Remove"}
                    </button>
                  </>
                )}
              </div>
            </article>
          );
        })}

        <button
          type="button"
          onClick={() => setInviteOpen(true)}
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

      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black">
              <h2 className="font-black text-lg">
                {viewing.engineer?.name ?? `Engineer #${viewing.engineerProfileId}`}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setViewing(null)}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 border-2 border-black overflow-hidden shrink-0 bg-gray-100">
                  <AvatarImage
                    src={viewing.engineer?.avatarUrl}
                    fallbackSrc={fallbackAvatar(viewing.engineerProfileId, viewing.engineer?.name)}
                    alt={viewing.engineer?.name ?? "Team member"}
                    fill
                    sizes="64px"
                    className="object-cover grayscale"
                  />
                </div>
                <div>
                  <p className="font-bold">{viewing.roleInTeam ?? "Member"}</p>
                  <p className="text-xs text-gray-500">Engineer Profile ID: {viewing.engineerProfileId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm border-t-2 border-black pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">Specialization</p>
                  <p className="font-bold">{viewing.engineer?.specialization ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">Availability</p>
                  <p className="font-bold">{viewing.engineer?.availabilityStatus ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">Location</p>
                  <p className="font-bold">{viewing.engineer?.location || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-500">Approval</p>
                  <p className="font-bold">{viewing.approvalStatus ?? "—"}</p>
                </div>
              </div>

              {viewing.engineer?.bio && (
                <div className="border-t-2 border-black pt-4">
                  <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Bio</p>
                  <p className="text-sm text-gray-700 leading-6 break-words">{viewing.engineer.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {inviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black">
              <h2 className="font-black text-lg">Invite Member</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setInviteOpen(false)}
                className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              {/* There's no team-role search endpoint to look engineers up by
                  name — POST /team/members only accepts a raw engineerProfileId,
                  so that's the only input this form can offer right now. */}
              <p className="text-xs text-gray-500 bg-gray-50 border-2 border-gray-200 px-3 py-2">
                There&apos;s no engineer lookup for teams yet — ask the engineer for their
                profile ID and enter it below.
              </p>
              <label className="block">
                <span className="block text-xs font-bold uppercase mb-1">Engineer Profile ID</span>
                <input
                  name="engineerProfileId"
                  type="number"
                  min={1}
                  required
                  className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-bold uppercase mb-1">Role (optional)</span>
                <input
                  name="roleInTeam"
                  placeholder="e.g. Structural Engineer"
                  className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
              {inviteError && (
                <p className="text-sm text-red-600 font-medium">{inviteError}</p>
              )}
              <button
                type="submit"
                disabled={inviting}
                className="w-full border-2 border-black bg-[#86efac] hover:bg-[#6fdb95] py-3 font-bold text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
              >
                {inviting ? "Sending…" : "Send Invite"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
