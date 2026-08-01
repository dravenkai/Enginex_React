"use client";

import { useState } from "react";
import {
  Plus,
  Bell,
  User,
  LogOut,
  Search,
  Star,
  FileText,
} from "lucide-react";

const tabs = ["Browse Engineers", "My Projects", "Contracts"] as const;
type Tab = (typeof tabs)[number];

const engineers = [
  { name: "Sarah Johnson", field: "Civil Engineering", rate: "$85/hr", rating: "4.9", projects: 23 },
  { name: "Michael Chen", field: "Mechanical Engineering", rate: "$90/hr", rating: "4.8", projects: 31 },
  { name: "Emily Rodriguez", field: "Architect Engineering", rate: "$95/hr", rating: "5", projects: 18 },
  { name: "David Kumar", field: "Structural Engineering", rate: "$88/hr", rating: "4.7", projects: 27 },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-[#93c5fd]",
  Completed: "bg-[#86efac]",
  Pending: "bg-[#fef08a]",
};

const projects = [
  { title: "Office Building Renovation", status: "In Progress", engineer: "Sarah Johnson", budget: "$45,000" },
  { title: "Bridge Inspection Report", status: "Completed", engineer: "David Kumar", budget: "$12,500" },
  { title: "HVAC System Design", status: "Pending", engineer: "Michael Chen", budget: "$28,000" },
];

export default function ClientHubPage() {
  const [tab, setTab] = useState<Tab>("Browse Engineers");

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-mono text-zinc-900">
      <header className="bg-white border-b-4 border-black flex items-center justify-between px-5 py-3 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 grid place-items-center border-2 border-black">
            <Plus className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-black uppercase tracking-wide">Enginex Client Hub</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 grid place-items-center border-2 border-black bg-[#fef08a]" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-black" />
          </button>
          <button className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold">
            <User className="w-4 h-4" />
            Client Account
          </button>
          <button className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="p-5">
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

        {tab === "Browse Engineers" && (
          <>
            <div className="flex gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, field, or expertise..."
                  className="w-full h-11 pl-10 pr-4 border-2 border-black bg-white text-sm outline-none focus:bg-blue-50"
                />
              </div>
              <button className="border-2 border-black bg-[#7ba2f2] hover:bg-[#6994ed] px-6 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                Search
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {engineers.map((engineer) => (
                <div key={engineer.name} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base">{engineer.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{engineer.field}</p>
                    </div>
                    <span className="shrink-0 border-2 border-black bg-[#93c5fd] px-2 py-1 text-xs font-bold">{engineer.rate}</span>
                  </div>

                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 border border-black bg-[#fef08a] px-2 py-1 text-xs font-bold">
                      <Star className="w-3 h-3 fill-black" />
                      {engineer.rating} • {engineer.projects} Projects
                    </span>
                  </div>

                  <button className="w-full mt-4 border-2 border-black bg-[#7ba2f2] hover:bg-[#6994ed] py-3 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                    View Profile &amp; Hire
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "My Projects" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Active Projects</h2>
              <button className="flex items-center gap-2 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="bg-white border-2 border-black p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    <h3 className="font-bold text-base">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className={`${statusColors[project.status]} border border-black px-2 py-0.5 font-bold uppercase`}>
                        {project.status}
                      </span>
                      <span className="text-gray-600">Engineer: {project.engineer}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="border-2 border-black bg-[#fef08a] px-3 py-2 text-xs font-bold">{project.budget}</span>
                    <button className="border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Contracts" && (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <FileText className="w-10 h-10" />
            <h2 className="mt-4 text-xl font-bold">Contract Management</h2>
            <p className="mt-2 text-sm text-gray-600">View and manage all your engineering contracts here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
