import { apiRequest, asArray } from "./http";

export interface ClientProfileData {
  bio?: string;
  avatarUrl?: string;
  location?: string;
  // Read-only here — the live ClientProfile PUT schema only accepts
  // bio/avatarUrl/location. There's no endpoint for a client to change their
  // own display name (it's set once at registration; only visible via the
  // Admin API otherwise), so `name` is only ever populated from the GET
  // response, never sent back on update.
  name?: string;
  email?: string;
  phone?: string;
}

// Like the engineer endpoint, this nests profile fields (bio/avatarUrl/location)
// under `clientProfile` and calls the display name `fullName` instead of `name`.
interface RawClientProfileResponse {
  fullName?: string;
  email?: string;
  phone?: string;
  clientProfile?: {
    bio?: string;
    avatarUrl?: string | null;
    location?: string;
  } | null;
}

function normalizeClientProfile(raw: RawClientProfileResponse | null | undefined): ClientProfileData {
  const nested = raw?.clientProfile ?? {};
  return {
    name: raw?.fullName,
    email: raw?.email,
    phone: raw?.phone ?? undefined,
    bio: nested.bio,
    avatarUrl: nested.avatarUrl ?? undefined,
    location: nested.location,
  };
}

export const getClientProfile = async () =>
  normalizeClientProfile(await apiRequest<RawClientProfileResponse>("/clients/profile"));

// Matches components.schemas.ClientProfile exactly (bio/avatarUrl/location
// only — confirmed against the live OpenAPI contract). PUT fully replaces
// this object on the backend — any of these left out of the body gets reset
// to null server-side, so callers should always pass the full current
// values for fields they don't intend to change, not just the ones edited.
export interface ClientProfileUpdateInput {
  bio?: string;
  avatarUrl?: string;
  location?: string;
}

export const updateClientProfile = async (input: ClientProfileUpdateInput) =>
  normalizeClientProfile(
    await apiRequest<RawClientProfileResponse>("/clients/profile", {
      method: "PUT",
      body: JSON.stringify(input),
    })
  );

export interface EngineerSearchResult {
  id: number;
  name?: string;
  specialization?: "CIVIL" | "ARCHITECT" | "MECHANICAL" | "ELECTRICAL";
  avatarUrl?: string;
  location?: string;
  hourlyRate?: number;
  availabilityStatus?: "AVAILABLE" | "BUSY" | "ON_PROJECT";
  yearsOfExperience?: number;
  bio?: string;
  tuVerified?: boolean;
  email?: string;
  experiences?: unknown[];
  portfolios?: unknown[];
}

// The backend nests the engineer's display name/avatar under `user`, same as
// the engineer- and client-profile endpoints. Used by search results, the
// engineer detail lookup, and favorites (whose entries nest this again).
interface RawEngineerProfileEntry {
  id: number;
  specialization?: EngineerSearchResult["specialization"];
  bio?: string;
  avatarUrl?: string | null;
  yearsOfExperience?: number;
  availabilityStatus?: EngineerSearchResult["availabilityStatus"];
  hourlyRate?: number;
  location?: string;
  tuVerified?: boolean | null;
  experiences?: unknown[];
  portfolios?: unknown[];
  user?: { fullName?: string; profileImage?: string | null; email?: string } | null;
}

function normalizeEngineerEntry(raw: RawEngineerProfileEntry): EngineerSearchResult {
  return {
    id: raw.id,
    name: raw.user?.fullName,
    specialization: raw.specialization,
    avatarUrl: raw.avatarUrl ?? raw.user?.profileImage ?? undefined,
    location: raw.location,
    hourlyRate: raw.hourlyRate,
    availabilityStatus: raw.availabilityStatus,
    yearsOfExperience: raw.yearsOfExperience,
    bio: raw.bio,
    tuVerified: raw.tuVerified ?? undefined,
    email: raw.user?.email,
    experiences: raw.experiences,
    portfolios: raw.portfolios,
  };
}

export const searchEngineers = async (query: string) =>
  asArray<RawEngineerProfileEntry>(
    await apiRequest(`/clients/search${query ? `?q=${encodeURIComponent(query)}` : ""}`)
  ).map(normalizeEngineerEntry);

export const getEngineerPublicProfile = async (id: number | string) =>
  normalizeEngineerEntry(await apiRequest<RawEngineerProfileEntry>(`/clients/engineers/${id}`));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTeamPublicProfile = (id: number | string) => apiRequest<any>(`/clients/teams/${id}`);

export interface FavoriteEntry {
  id: number;
  engineerProfileId: number;
  engineer?: EngineerSearchResult;
}

interface RawFavoriteEntry {
  id: number;
  engineerProfileId: number;
  engineerProfile?: RawEngineerProfileEntry | null;
}

export const listFavorites = async () =>
  asArray<RawFavoriteEntry>(await apiRequest("/clients/favorites")).map((entry) => ({
    id: entry.id,
    engineerProfileId: entry.engineerProfileId,
    engineer: entry.engineerProfile ? normalizeEngineerEntry(entry.engineerProfile) : undefined,
  }));

export const addFavorite = (engineerProfileId: number) =>
  apiRequest("/clients/favorites", {
    method: "POST",
    body: JSON.stringify({ engineerProfileId }),
  });

// The backend's own OpenAPI spec documents this as DELETE /clients/favorites
// with ?engineerProfileId= as a query param — that 404s. Verified live that
// the route actually implemented is a path param instead.
export const removeFavorite = (engineerProfileId: number | string) =>
  apiRequest(`/clients/favorites/${engineerProfileId}`, { method: "DELETE" });

// Field set confirmed against the live OpenAPI contract at
// https://api.enginexmm.tech/api/docs/openapi.json (components.schemas.Project)
// — assignmentType/visibility are write-only (ProjectCreate), never part of
// the read model, so they're intentionally not here; a fetched project will
// never actually have them populated.
export interface ClientProject {
  id: number;
  title: string;
  description?: string;
  // Returned as numeric strings (e.g. "5000") by the backend, not numbers.
  budgetMin?: number | string;
  budgetMax?: number | string;
  location?: string;
  status?: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  selectedEngineerId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Matches components.schemas.ProjectCreate.
export interface ProjectInput {
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
  imageUrl?: string;
  // Required for the project to actually appear in the engineer-facing open
  // feed / be appliable to (verified live — a project needs BOTH
  // assignmentType: "OPEN" and visibility: "PUBLIC", otherwise
  // GET /engineers/projects/open won't return it and applying 403s). Only
  // settable here at creation — there's no way to change either afterward,
  // see ProjectUpdateInput below.
  assignmentType?: "OPEN" | "DIRECT";
  visibility?: "PUBLIC" | "PRIVATE";
}

export const createProject = (input: ProjectInput) =>
  apiRequest<ClientProject>("/clients/projects", { method: "POST", body: JSON.stringify(input) });

export const listClientProjects = async () =>
  asArray<ClientProject>(await apiRequest("/clients/projects"));

// Matches components.schemas.ProjectUpdate exactly — status/visibility/
// assignmentType are NOT accepted here (confirmed against the OpenAPI spec).
// selectedEngineerId is a non-nullable integer >= 1 on that schema, so there's
// no documented way to *clear* an assignment via this endpoint either.
export interface ProjectUpdateInput {
  selectedEngineerId?: number;
  title?: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
}

export const updateProject = (id: number | string, input: ProjectUpdateInput) =>
  apiRequest<ClientProject>(`/clients/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

// The spec documents this single endpoint as "Delete or cancel a
// client-owned project" — the backend decides which based on the project's
// own state (an OPEN project with nothing attached yet gets hard-deleted; a
// project with an engineer/applicants already gets cancelled instead). There
// is no separate cancel endpoint/field, so both actions in the UI call this.
export const deleteProject = (id: number | string) =>
  apiRequest(`/clients/projects/${id}`, { method: "DELETE" });

export interface ProjectApplicationEntry {
  id: number;
  projectId: number;
  engineerProfileId?: number;
  engineer?: EngineerSearchResult;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  proposedPrice?: number | string | null;
  message?: string | null;
  createdAt?: string;
}

interface RawProjectApplicationEntry {
  id: number;
  projectId: number;
  engineerProfileId?: number;
  engineer?: RawEngineerProfileEntry | null;
  engineerProfile?: RawEngineerProfileEntry | null;
  status?: ProjectApplicationEntry["status"];
  proposedPrice?: number | string | null;
  message?: string | null;
  createdAt?: string;
}

export const listProjectApplications = async (projectId: number | string) =>
  asArray<RawProjectApplicationEntry>(
    await apiRequest(`/clients/projects/${projectId}/applications`)
  ).map((entry) => ({
    id: entry.id,
    projectId: entry.projectId,
    engineerProfileId: entry.engineerProfileId,
    engineer: entry.engineer
      ? normalizeEngineerEntry(entry.engineer)
      : entry.engineerProfile
        ? normalizeEngineerEntry(entry.engineerProfile)
        : undefined,
    status: entry.status,
    proposedPrice: entry.proposedPrice,
    message: entry.message,
    createdAt: entry.createdAt,
  }));

export const reviewApplication = (
  projectId: number | string,
  applicationId: number | string,
  status: "ACCEPTED" | "REJECTED"
) =>
  apiRequest(`/clients/projects/${projectId}/applications/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
