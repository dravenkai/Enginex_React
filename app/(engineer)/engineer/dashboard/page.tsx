"use client";

import { useState } from "react";
import {
  Plus,
  Bell,
  User,
  LogOut,
  DollarSign,
  Clock,
  Award,
  FileText,
} from "lucide-react";

const stats = [
  { label: "Active Bids", value: "7", color: "bg-[#93c5fd]" },
  { label: "Projects Won", value: "23", color: "bg-[#86efac]" },
  { label: "Total Earned", value: "$147K", color: "bg-[#fef08a]" },
  { label: "Rating", value: "4.9⭐", color: "bg-white" },
];

const tabs = ["Available Projects", "My Portfolio", "My Proposals"] as const;
type Tab = (typeof tabs)[number];

const projects = [
  {
    title: "Residential Complex Design",
    client: "Urban Developers Ltd",
    budget: "$35,000",
    duration: "3 months",
    posted: "Posted 2 days ago",
  },
  {
    title: "Highway Bridge Assessment",
    client: "State Infrastructure",
    budget: "$18,500",
    duration: "6 weeks",
    posted: "Posted 5 days ago",
  },
  {
    title: "Factory HVAC Upgrade",
    client: "Manufacturing Co",
    budget: "$42,000",
    duration: "4 months",
    posted: "Posted 1 week ago",
  },
];

export default function EngineerDashboardPage() {
  const [tab, setTab] = useState<Tab>("Available Projects");

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-mono text-zinc-900">
      <header className="bg-white border-b-4 border-black flex items-center justify-between px-5 py-3 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 grid place-items-center border-2 border-black">
            <Plus className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-black uppercase tracking-wide">Enginex Engineer Portal</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 grid place-items-center border-2 border-black bg-[#93c5fd]" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
          </button>
          <button className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold">
            <User className="w-4 h-4" />
            Engineer Account
          </button>
          <button className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="p-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.color} border-2 border-black text-center py-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              aria-pressed={tab === item}
              className={`border-2 border-black px-4 py-2 text-xs font-bold uppercase transition-colors ${
                tab === item ? "bg-[#93c5fd] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "Available Projects" && (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.title}
                className="bg-white border-2 border-black p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div>
                  <h3 className="font-bold text-base">{project.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Client: {project.client}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="bg-[#fef08a] border border-black px-1.5 py-0.5 font-bold">{project.budget}</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      {project.duration}
                    </span>
                    <span className="bg-[#93c5fd] border border-black px-1.5 py-0.5 font-bold">{project.posted}</span>
                  </div>
                </div>
                <button className="shrink-0 border-2 border-black bg-[#93c5fd] hover:bg-[#7ba2f2] px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                  Submit Proposal
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "My Portfolio" && (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <Award className="w-10 h-10" />
            <h2 className="mt-4 text-xl font-bold">Your Portfolio</h2>
            <p className="mt-2 text-sm text-gray-600">Showcase your completed projects and certifications.</p>
            <button className="mt-6 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-5 py-3 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
              Build Your Portfolio
            </button>
          </div>
        )}

        {tab === "My Proposals" && (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <FileText className="w-10 h-10" />
            <h2 className="mt-4 text-xl font-bold">Your Proposals</h2>
            <p className="mt-2 text-sm text-gray-600">Track your submitted proposals and their status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
