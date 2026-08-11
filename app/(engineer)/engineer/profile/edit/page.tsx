"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Settings2,
  ChevronRight,
  Trash2,
  BellRing,
  Network,
  FileUp,
} from "lucide-react";
import { ApiError } from "@/lib/api/http";
import { getEngineerProfile, updateEngineerProfile } from "@/lib/api/engineers";
import { useApiResource } from "@/lib/api/useApiResource";
import { useAuthStore } from "@/lib/auth/store";

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

const specializationOptions = [
  { value: "CIVIL", label: "Civil" },
  { value: "ARCHITECT", label: "Architect" },
  { value: "MECHANICAL", label: "Mechanical" },
  { value: "ELECTRICAL", label: "Electrical" },
] as const;

export default function EngineerProfileEditPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: profile, loading } = useApiResource(getEngineerProfile, []);

  const [alerts, setAlerts] = useState({ projects: true, marketplace: true, community: false });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      await updateEngineerProfile({
        name: String(form.get("name") ?? ""),
        specialization: form.get(
          "specialization"
        ) as (typeof specializationOptions)[number]["value"],
        phone: String(form.get("phone") ?? ""),
        location: String(form.get("location") ?? ""),
        bio: String(form.get("bio") ?? ""),
      });
      router.push("/engineer/profile");
    } catch (error) {
      setSaveError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again."
      );
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
            href="/engineer/profile"
            className="border-2 border-black bg-white px-5 py-2.5 text-xs font-bold uppercase hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || loading}
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
                  <Image
                    src={profile?.avatarUrl || profile?.profileImage || "/profile.avif"}
                    alt={profile?.name ?? user?.name ?? "Profile photo"}
                    fill
                    unoptimized={Boolean(profile?.avatarUrl || profile?.profileImage)}
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase underline hover:no-underline"
                >
                  Change Photo
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Full Name</span>
                  <input
                    name="name"
                    defaultValue={profile?.name ?? user?.name ?? ""}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-xs font-bold uppercase mb-1">Specialization</span>
                    <select
                      name="specialization"
                      defaultValue={profile?.specialization ?? "CIVIL"}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {specializationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs font-bold uppercase mb-1">Phone</span>
                    <input
                      name="phone"
                      defaultValue={profile?.phone ?? ""}
                      className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </label>
                </div>
              </div>
            </div>

            <label className="block mt-6">
              <span className="block text-xs font-bold uppercase mb-1">Professional Bio</span>
              <div className="border-2 border-black">
                <div className="flex items-center gap-3 px-3 py-2 border-b-2 border-black bg-gray-50 text-gray-500">
                  <Bold className="w-4 h-4" />
                  <Italic className="w-4 h-4" />
                  <List className="w-4 h-4" />
                  <LinkIcon className="w-4 h-4 ml-auto" />
                </div>
                <textarea
                  rows={5}
                  name="bio"
                  defaultValue={profile?.bio ?? ""}
                  placeholder="Specializing in..."
                  className="w-full p-3 text-sm leading-6 focus:outline-none resize-y"
                />
              </div>
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

            <section
              key={profile ? "loaded" : "pending"}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
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
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Location</span>
                  <input
                    name="location"
                    defaultValue={profile?.location ?? ""}
                    placeholder="City, Country"
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
              <h2 className="font-bold text-sm uppercase">Portfolio</h2>
              <span className="text-[10px] font-bold text-gray-500">PDF (MAX 50MB)</span>
            </div>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black bg-gray-50 hover:bg-gray-100 py-10 text-center cursor-pointer transition-colors">
              <span className="w-10 h-10 border-2 border-black bg-black text-white flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </span>
              {portfolioFile ? (
                <span className="text-xs font-bold px-4">
                  {portfolioFile.name}
                  <span className="block text-gray-500 font-medium mt-0.5">
                    ({Math.max(1, Math.round(portfolioFile.size / 1024 / 1024))} mb)
                  </span>
                </span>
              ) : (
                <span className="text-xs text-gray-500 px-4">
                  Drag &amp; Drop Schematics
                  <br />
                  or click to browse local directory
                </span>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(event) => setPortfolioFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </section>

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
        </div>
      </div>
    </form>
  );
}
