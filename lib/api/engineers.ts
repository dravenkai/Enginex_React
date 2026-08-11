import { apiRequest } from "./http";

export interface EngineerProfileData {
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

export const getEngineerProfile = () => apiRequest<EngineerProfileData>("/engineers/profile");

export const updateEngineerProfile = (input: Partial<EngineerProfileData>) =>
  apiRequest<EngineerProfileData>("/engineers/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

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
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
}

export const listDirectProjects = () => apiRequest<DirectProject[]>("/engineers/direct-projects");

export interface CompanyEntry {
  id: number;
  companyName?: string;
  description?: string;
  location?: string;
}

export const listCompanies = () => apiRequest<CompanyEntry[]>("/engineers/companies");

export const applyToProject = (
  id: number | string,
  input: { message?: string; proposedPrice?: number }
) => apiRequest(`/engineers/projects/${id}/apply`, { method: "POST", body: JSON.stringify(input) });
