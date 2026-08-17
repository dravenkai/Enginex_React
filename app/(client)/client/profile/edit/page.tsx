"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Settings2,
  ChevronRight,
  Trash2,
  BellRing,
  Network,
  ShieldCheck,
} from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import { friendlyErrorMessage } from "@/lib/api/http";
import { getClientProfile, updateClientProfile } from "@/lib/api/clients";
import { uploadProfileImage, profileImageUrl } from "@/lib/api/profileImage";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";
import { locationSelectOptions } from "@/lib/constants/locations";
import { useMounted } from "@/lib/useMounted";

const alertOptions = [
  {
    key: "projects" as const,
    title: "Project Updates",
    copy: "New milestones and engineering review notifications.",
  },
  {
    key: "marketplace" as const,
    title: "Marketplace Alerts",
    copy: "Price fluctuations and new available manufacturing slots.",
  },
  {
    key: "community" as const,
    title: "Community News",
    copy: "Weekly digest of Enginex ecosystem developments.",
  },
];

export default function ProfileEditPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: profile, loading } = useApiResource(getClientProfile, []);
  const mounted = useMounted();

  const [alerts, setAlerts] = useState({ projects: true, marketplace: true, community: false });
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setSaveError("");
    setAvatarUploading(true);
    try {
      // Dedicated profile-image endpoint (POST /users/profile-image) rather
      // than the generic upload-then-PATCH-a-URL flow — it acts on the
      // authenticated user directly and is served back through our own
      // proxy (GET /users/{id}/profile-image), avoiding the private-bucket
      // 403s the old avatarUrl-based photos ran into.
      await uploadProfileImage(file);
      setAvatarVersion((current) => current + 1);
    } catch (error) {
      setSaveError(friendlyErrorMessage(error, "Couldn't upload that photo. Please try again."));
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const bio = String(form.get("bio") ?? "");
      const location = String(form.get("location") ?? "");
      // No `name` field here — the live ClientProfile PUT schema doesn't
      // accept one (confirmed against the OpenAPI contract), so a client's
      // display name can't actually be changed from this form.
      await updateClientProfile({ bio, location });
      router.push("/client/profile");
    } catch (error) {
      setSaveError(friendlyErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black">Manage Identity</h1>
          <p className="text-sm text-gray-600 mt-1">
            Update your professional presence on Enginex.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/client/profile"
            className="border-2 border-black bg-white px-5 py-2.5 text-xs font-bold uppercase hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={mounted && (saving || loading)}
            className="border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-5 py-2.5 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border-2 border-red-400 text-red-700 p-4 text-sm font-medium mb-6">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section
            key={profile ? "loaded" : "pending"}
            className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="relative w-32 h-32 border-2 border-black overflow-hidden bg-[#93c5fd]">
                  <AvatarImage
                    src={user?.id ? profileImageUrl(user.id, avatarVersion || undefined) : null}
                    fallbackSrc="/profile.avif"
                    alt={user?.name ?? "Profile photo"}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <label className="text-[10px] font-bold uppercase underline hover:no-underline cursor-pointer">
                  {avatarUploading ? "Uploading…" : "Change Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={avatarUploading}
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Full Name</span>
                  <input
                    readOnly
                    defaultValue={profile?.name ?? user?.name ?? ""}
                    className="w-full border-2 border-black bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Set when you registered — there&apos;s no self-service way to change it yet.
                  </span>
                </label>
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Location</span>
                  <select
                    name="location"
                    defaultValue={profile?.location ?? ""}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="" disabled>
                      Select a location
                    </option>
                    {locationSelectOptions(profile?.location).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <label className="block mt-6">
              <span className="block text-xs font-bold uppercase mb-1">Professional Bio</span>
              <textarea
                rows={5}
                name="bio"
                defaultValue={profile?.bio ?? ""}
                placeholder="Tell engineers a bit about yourself or your company…"
                className="w-full border-2 border-black p-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-black resize-y"
              />
            </label>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="flex items-center gap-2 font-bold text-sm uppercase pb-3 mb-4 border-b-2 border-black">
                <BellRing className="w-4 h-4" /> Alerts
              </h2>
              <div className="space-y-4">
                {alertOptions.map((item) => (
                  <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alerts[item.key]}
                      onChange={(event) =>
                        setAlerts((current) => ({ ...current, [item.key]: event.target.checked }))
                      }
                      className="mt-1 w-4 h-4 accent-[#3973cf] border-2 border-black shrink-0"
                    />
                    <span>
                      <span className="block font-bold text-sm">{item.title}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">{item.copy}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="flex items-center gap-2 font-bold text-sm uppercase pb-3 mb-4 border-b-2 border-black">
                <Network className="w-4 h-4" /> Contact
              </h2>
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Email Address</span>
                  <input
                    readOnly
                    defaultValue={profile?.email ?? user?.email ?? ""}
                    className="w-full border-2 border-black bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="flex items-center gap-2 font-bold text-sm uppercase pb-3 mb-4 border-b-2 border-black">
              <Settings2 className="w-4 h-4" /> Security
            </h2>
            <button
              type="button"
              className="w-full flex items-center justify-between border-2 border-black px-4 py-3 text-xs font-bold uppercase hover:bg-gray-100 transition-colors mb-4"
            >
              Change Password <ChevronRight className="w-4 h-4" />
            </button>
            <label className="block mb-4">
              <span className="block text-xs font-bold uppercase mb-1">Preferred Language</span>
              <select
                defaultValue="English"
                className="w-full border-2 border-black px-3 py-2 text-sm font-medium bg-white focus:outline-none"
              >
                <option>English</option>
                <option>Myanmar</option>
                <option>Spanish</option>
              </select>
            </label>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border-2 border-black bg-red-100 hover:bg-red-200 px-4 py-3 text-xs font-bold uppercase text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Deactivate Account
            </button>
          </section>

          <section className="relative bg-red-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white overflow-hidden">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-red-300/50" />
            <h2 className="relative font-bold text-sm uppercase mb-3">Verification Status</h2>
            <p className="relative text-sm leading-6 mb-4">
              Your profile is currently <span className="underline font-bold">not verified</span>{" "}
              yet. Make sure to verify to post requests.
            </p>
            <button
              type="button"
              className="relative border-2 border-black bg-black text-white px-4 py-2.5 text-xs font-bold uppercase hover:bg-gray-900 transition-colors"
            >
              Start Assessment
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}
