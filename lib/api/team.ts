import { apiRequest, asArray } from "./http";
import type { EngineerProfileData } from "./engineers";

export interface TeamProfileData {
  companyName?: string;
  description?: string;
  website?: string;
  location?: string;
}

export const getTeamProfile = () => apiRequest<TeamProfileData>("/team/profile");

export const updateTeamProfile = (input: Partial<TeamProfileData>) =>
  apiRequest<TeamProfileData>("/team/profile", { method: "PATCH", body: JSON.stringify(input) });

export interface TeamMemberEntry {
  id: number;
  engineerProfileId: number;
  roleInTeam?: string;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
  engineer?: EngineerProfileData;
}

export const listTeamMembers = async () =>
  asArray<TeamMemberEntry>(await apiRequest("/team/members"));

export const inviteMember = (input: { engineerProfileId: number; roleInTeam?: string }) =>
  apiRequest("/team/members", { method: "POST", body: JSON.stringify(input) });

export const removeMember = (memberId: number | string) =>
  apiRequest(`/team/members/${memberId}`, { method: "DELETE" });

// These two are ENGINEER-role endpoints, not team/company-role — per the
// backend's own OpenAPI spec, GET /team/invitations is "the current
// engineer's team invitations" (invites an engineer has received from
// teams), and the decision endpoint is how that engineer accepts/rejects
// one. A COMPANY-role account calling these gets 403 Forbidden. For a
// team's own view of its pending invites, use listTeamMembers() filtered to
// approvalStatus === "PENDING" instead.
export const listInvitations = async () =>
  asArray<TeamMemberEntry>(await apiRequest("/team/invitations"));

export const decideInvitation = (memberId: number | string, approvalStatus: "APPROVED" | "REJECTED") =>
  apiRequest(`/team/members/${memberId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ approvalStatus }),
  });
