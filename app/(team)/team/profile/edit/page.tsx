"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Globe, Settings2, ChevronRight, Trash2, BellRing, Network } from "lucide-react";
import { friendlyErrorMessage } from "@/lib/api/http";
import { getTeamProfile, updateTeamProfile } from "@/lib/api/team";
import { useApiResource } from "@/lib/api/useApiResource";
import { locationSelectOptions } from "@/lib/constants/locations";
import { useMounted } from "@/lib/useMounted";

const alertOptions = [
  {
    key: "applications" as const,
    title: "Applicant Updates",
    copy: "New engineer applications and invitation responses.",
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

export default function TeamProfileEditPage() {
  const router = useRouter();
  const { data: profile, loading } = useApiResource(getTeamProfile, []);
  const mounted = useMounted();

  const [alerts, setAlerts] = useState({ applications: true, marketplace: true, community: false });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      await updateTeamProfile({
        companyName: String(form.get("companyName") ?? ""),
        description: String(form.get("description") ?? ""),
        website: String(form.get("website") ?? ""),
        location: String(form.get("location") ?? ""),
      });
      router.push("/team/profile");
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
          <h1 className="text-3xl font-black">Manage Team Identity</h1>
          <p className="text-sm text-gray-600 mt-1">
            Update your company&apos;s professional presence on Enginex.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/team/profile"
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
                  <Image
                    src="/profile.avif"
                    alt={profile?.companyName ?? "Team logo"}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase underline hover:no-underline"
                >
                  Change Logo
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Company Name</span>
                  <input
                    name="companyName"
                    defaultValue={profile?.companyName ?? ""}
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-bold uppercase mb-1">Website</span>
                  <input
                    name="website"
                    defaultValue={profile?.website ?? ""}
                    placeholder="https://…"
                    className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </label>
              </div>
            </div>

            <label className="block mt-6">
              <span className="block text-xs font-bold uppercase mb-1">Company Description</span>
              <textarea
                rows={5}
                name="description"
                defaultValue={profile?.description ?? ""}
                placeholder="Tell clients about your team's capabilities…"
                className="w-full border-2 border-black p-3 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-black resize-y"
              />
            </label>
          </section>

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
        </div>

        <div className="space-y-8">
          <section
            key={profile ? "loaded" : "pending"}
            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <h2 className="flex items-center gap-2 font-bold text-sm uppercase pb-3 mb-4 border-b-2 border-black">
              <Network className="w-4 h-4" /> Contact
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> HQ Location
                </span>
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
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border-2 border-black bg-red-100 hover:bg-red-200 px-4 py-3 text-xs font-bold uppercase text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Deactivate Team
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}
