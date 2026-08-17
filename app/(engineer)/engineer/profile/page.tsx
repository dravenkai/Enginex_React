"use client";

import Link from "next/link";
import AvatarImage from "@/components/AvatarImage";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { Briefcase, Camera, Mail, MapPin, RotateCw } from "lucide-react";
import { friendlyErrorMessage } from "@/lib/api/http";
import { getEngineerProfile, listDirectProjects, updateAvailability } from "@/lib/api/engineers";
import { uploadProfileImage, profileImageUrl } from "@/lib/api/profileImage";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";
import { fallbackAvatar } from "@/lib/constants/avatars";

const specializationLabels: Record<string, string> = {
  CIVIL: "Civil Engineer",
  ARCHITECT: "Architect",
  MECHANICAL: "Mechanical Engineer",
  ELECTRICAL: "Electrical Engineer",
};

const availabilityOptions = [
  { value: "AVAILABLE", label: "Available", color: "bg-green-300" },
  { value: "BUSY", label: "Busy", color: "bg-orange-300" },
  { value: "ON_PROJECT", label: "On Project", color: "bg-[#93c5fd]" },
] as const;

export default function EngineerProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, loading, error, reload } = useApiResource(getEngineerProfile, []);
  const { data: directProjects } = useApiResource(listDirectProjects, []);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");

  async function handleStatusChange(status: (typeof availabilityOptions)[number]["value"]) {
    setStatusError("");
    setStatusUpdating(true);
    try {
      await updateAvailability(status);
      reload();
    } catch (err) {
      setStatusError(friendlyErrorMessage(err, "Couldn't update your status. Please try again."));
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatarError("");
    setAvatarUploading(true);
    try {
      await uploadProfileImage(file);
      setAvatarVersion((current) => current + 1);
      reload();
    } catch (err) {
      setAvatarError(friendlyErrorMessage(err, "Couldn't update your photo. Please try again."));
    } finally {
      setAvatarUploading(false);
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {avatarError && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium">
          {avatarError}
        </div>
      )}
      {statusError && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium">
          {statusError}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium flex items-center justify-between gap-4">
          <span>Couldn&apos;t load your profile from the server.</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <div className="w-28 h-28 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative bg-gray-100">
              <AvatarImage
                src={user?.id ? profileImageUrl(user.id, avatarVersion || undefined) : null}
                fallbackSrc={fallbackAvatar(profile?.id, profile?.name)}
                alt={profile?.name ?? user?.name ?? "Profile photo"}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <label
              aria-label="Change profile photo"
              className="absolute -bottom-2 -right-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-8 h-8 grid place-items-center bg-[#93c5fd] border-2 border-black hover:bg-[#7ca3ef] cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={avatarUploading}
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black">
                {loading ? "Loading…" : (profile?.name ?? user?.name ?? "Your Name").toUpperCase()}
              </h2>
              <Link
                href="/engineer/profile/edit"
                className="shrink-0 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-4 py-2 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                Edit Profile
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {availabilityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleStatusChange(option.value)}
                  className={`border-2 border-black px-3 py-1.5 text-[10px] font-bold uppercase transition-colors disabled:opacity-60 ${
                    profile?.availabilityStatus === option.value
                      ? `${option.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-1 text-xs text-gray-600 pb-3 border-b border-black">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {profile?.specialization
                  ? specializationLabels[profile.specialization]
                  : "No specialization set"}
              </div>
              {profile?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {profile?.email ?? user?.email ?? "—"}
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-700 leading-6 break-words">
              {profile?.bio || "No bio yet — add one from Edit Profile."}
            </p>
          </div>
        </div>

        <div className="bg-[#fef08a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-widest">Active Projects</span>
          <span className="text-6xl font-black my-3">{directProjects?.length ?? "—"}</span>
          <Link
            href="/engineer/my-projects"
            className="w-full border-2 border-black bg-black text-white hover:bg-gray-900 px-4 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-center"
          >
            View All Projects
          </Link>
        </div>
      </div>

      <div className="bg-gray-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold">ACCOUNT SECURITY</h2>
          <p className="mt-2 max-w-lg text-sm text-gray-600 leading-6">
            Your profile is currently protected by Two-Factor Authentication. Keep your contact
            information updated to ensure project continuity.
          </p>
        </div>

        <div className="flex flex-col gap-3 shrink-0 sm:w-56">
          <button
            type="button"
            className="border-2 border-black bg-white px-4 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            Security Log
          </button>
          <button
            type="button"
            className="border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-4 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            Manage Keys
          </button>
        </div>
      </div>
    </div>
  );
}
