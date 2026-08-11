import { apiRequest } from "./http";

export interface ClientProfileData {
  bio?: string;
  avatarUrl?: string;
  location?: string;
  name?: string;
  email?: string;
}

export const getClientProfile = () => apiRequest<ClientProfileData>("/clients/profile");

export const updateClientProfile = (input: Partial<ClientProfileData>) =>
  apiRequest<ClientProfileData>("/clients/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });

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
}

export const searchEngineers = (query: string) =>
  apiRequest<EngineerSearchResult[]>(
    `/clients/search${query ? `?q=${encodeURIComponent(query)}` : ""}`
  );

export const getEngineerPublicProfile = (id: number | string) =>
  apiRequest<EngineerSearchResult>(`/clients/engineers/${id}`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTeamPublicProfile = (id: number | string) => apiRequest<any>(`/clients/teams/${id}`);

export interface FavoriteEntry {
  id: number;
  engineerProfileId: number;
  engineer?: EngineerSearchResult;
}

export const listFavorites = () => apiRequest<FavoriteEntry[]>("/clients/favorites");

export const addFavorite = (engineerProfileId: number) =>
  apiRequest("/clients/favorites", {
    method: "POST",
    body: JSON.stringify({ engineerProfileId }),
  });

export interface ProjectInput {
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
}

export const createProject = (input: ProjectInput) =>
  apiRequest("/clients/projects", { method: "POST", body: JSON.stringify(input) });
