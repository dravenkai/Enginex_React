import { apiRequest, asArray } from "./http";

export interface EngineerProfileData {
  // The engineer profile's own id (engineerProfile.id on the backend) — the
  // same id space used everywhere else an engineer is referenced
  // (marketplace, favorites, team members, applicants). Needed so a
  // per-engineer deterministic pick (like the avatar placeholder) lands on
  // the same result here as it does on every other page showing this person.
  id?: number;
  name?: string;
  phone?: string;
  profileImage?: string;
  specialization?: "CIVIL" | "ARCHITECT" | "MECHANICAL" | "ELECTRICAL";
  bio?: string;
  avatarUrl?: string;
  yearsOfExperience?: number;
  availabilityStatus?: "AVAILABLE" | "BUSY" | "ON_PROJECT";
  hourlyRate?: number;
  location?: string;
  email?: string;
}

// The backend nests engineer-specific fields (specialization/bio/avatarUrl/location/…)
// under `engineerProfile`, and calls the display name `fullName` instead of `name`.
// Both GET and PATCH /engineers/profile return this same nested shape, so both
// responses go through this to give callers one flat, consistent object.
interface RawEngineerProfileResponse {
  name?: string;
  fullName?: string;
  phone?: string;
  profileImage?: string | null;
  email?: string;
  engineerProfile?: {
    id?: number;
    specialization?: EngineerProfileData["specialization"];
    bio?: string;
    avatarUrl?: string | null;
    yearsOfExperience?: number;
    availabilityStatus?: EngineerProfileData["availabilityStatus"];
    hourlyRate?: number;
    location?: string;
  } | null;
}

function normalizeEngineerProfile(raw: RawEngineerProfileResponse | null | undefined): EngineerProfileData {
  const nested = raw?.engineerProfile ?? {};
  return {
    id: nested.id,
    name: raw?.name ?? raw?.fullName,
    phone: raw?.phone,
    profileImage: raw?.profileImage ?? undefined,
    email: raw?.email,
    specialization: nested.specialization,
    bio: nested.bio,
    avatarUrl: nested.avatarUrl ?? undefined,
    yearsOfExperience: nested.yearsOfExperience,
    availabilityStatus: nested.availabilityStatus,
    hourlyRate: nested.hourlyRate,
    location: nested.location,
  };
}

export const getEngineerProfile = async () =>
  normalizeEngineerProfile(await apiRequest<RawEngineerProfileResponse>("/engineers/profile"));

export const updateEngineerProfile = async (input: Partial<EngineerProfileData>) =>
  normalizeEngineerProfile(
    await apiRequest<RawEngineerProfileResponse>("/engineers/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  );

export const updateAvailability = (
  availabilityStatus: NonNullable<EngineerProfileData["availabilityStatus"]>
) =>
  apiRequest("/engineers/profile/status", {
    method: "PUT",
    body: JSON.stringify({ availabilityStatus }),
  });

export interface DirectProject {
  id: number;
  title: string;
  description?: string;
  // The backend returns these as numeric strings (e.g. "5000"), not numbers.
  budgetMin?: number | string;
  budgetMax?: number | string;
  location?: string;
  status?: string;
  // Present on the live response (same underlying Project schema as
  // components.schemas.Project) but wasn't previously typed here — needed to
  // derive a submission-deadline estimate on the marketplace detail page,
  // since the backend has no deadline field of its own.
  createdAt?: string;
}

export const listDirectProjects = async () =>
  asArray<DirectProject>(await apiRequest("/engineers/direct-projects"));

// Open projects available to browse/apply to (assignmentType: "OPEN" AND
// visibility: "PUBLIC" on the client's side — verified live that both are
// required or a project won't show up here and applying to it 403s).
export const listOpenProjects = async () =>
  asArray<DirectProject>(await apiRequest("/engineers/projects/open"));

export interface EngineerApplicationEntry {
  id: number;
  projectId: number;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  proposedPrice?: number | string | null;
  message?: string | null;
  createdAt?: string;
}

export const listMyApplications = async () =>
  asArray<EngineerApplicationEntry>(await apiRequest("/engineers/applications"));

export interface CompanyEntry {
  id: number;
  companyName?: string;
  description?: string;
  location?: string;
}

export const listCompanies = async () =>
  asArray<CompanyEntry>(await apiRequest("/engineers/companies"));

export const applyToProject = (
  id: number | string,
  input: { message?: string; proposedPrice?: number }
) => apiRequest(`/engineers/projects/${id}/apply`, { method: "POST", body: JSON.stringify(input) });
