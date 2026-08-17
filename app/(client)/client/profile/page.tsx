"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { Camera, Mail, MapPin, RotateCw } from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import { friendlyErrorMessage } from "@/lib/api/http";
import { getClientProfile, listClientProjects } from "@/lib/api/clients";
import { uploadProfileImage, profileImageUrl } from "@/lib/api/profileImage";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { data: profile, loading, error, reload } = useApiResource(getClientProfile, []);
  const { data: projects } = useApiResource(listClientProjects, []);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarVersion, setAvatarVersion] = useState(0);

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatarError("");
    setAvatarUploading(true);
    try {
      // Dedicated profile-image endpoint (POST /users/profile-image) rather
      // than the generic upload-then-PATCH-a-URL flow — see the comment in
      // lib/api/profileImage.ts for why.
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
                fallbackSrc="/profile.avif"
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
                href="/client/profile/edit"
                className="shrink-0 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-4 py-2 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                Edit Profile
              </Link>
            </div>

            <div className="mt-2 space-y-1 text-xs text-gray-600 pb-3 border-b border-black">
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

        <div className="bg-[#7ca3ef] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center text-white">
          <span className="text-xs font-bold uppercase tracking-widest">Active Projects</span>
          <span className="text-6xl font-black my-3">
            {projects
              ? projects.filter((p) => p.status !== "COMPLETED" && p.status !== "CANCELLED").length
              : "—"}
          </span>
          <Link
            href="/client/my-projects"
            className="w-full border-2 border-black bg-white text-black px-4 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-center"
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
