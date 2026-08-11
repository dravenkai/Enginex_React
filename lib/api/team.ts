import { apiRequest } from "./http";
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

export const listTeamMembers = () => apiRequest<TeamMemberEntry[]>("/team/members");

export const inviteMember = (input: { engineerProfileId: number; roleInTeam?: string }) =>
  apiRequest("/team/members", { method: "POST", body: JSON.stringify(input) });

export const removeMember = (memberId: number | string) =>
  apiRequest(`/team/members/${memberId}`, { method: "DELETE" });

export const listInvitations = () => apiRequest<TeamMemberEntry[]>("/team/invitations");

export const decideInvitation = (memberId: number | string, approvalStatus: "APPROVED" | "REJECTED") =>
  apiRequest(`/team/members/${memberId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ approvalStatus }),
  });
