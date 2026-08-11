import Image from "next/image";
import { FileText, FileSpreadsheet, RotateCw, Users } from "lucide-react";
import { teamMembers } from "../_data";

const milestones = [
  {
    title: "Initial Structural Assessment",
    date: "Oct 12, 2024",
    status: "COMPLETE" as const,
  },
  {
    title: "Carbon-Fiber Wrapping (Pillars A-D)",
    description:
      "Application of high-tensile carbon fiber matrices to primary support pillars. Requires controlled temperature curing protocols.",
    status: "IN PROGRESS" as const,
    progress: 65,
    estCompletion: "Oct 28",
  },
  {
    title: "Road Testing & Verification",
    description: "Scheduled to begin following Phase 2 completion.",
    status: "UPCOMING" as const,
  },
];

const documents = [
  { name: "SKL-442_Blueprint_v3.pdf", meta: "12.4 MB • Updated Oct 10", icon: FileText, color: "text-blue-600" },
  { name: "Stress_Analysis_Data.xlsx", meta: "2.1 MB • Updated Oct 22", icon: FileSpreadsheet, color: "text-green-600" },
];

export default function ProjectPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">Infrastructure</p>
            <h1 className="text-4xl font-black mt-1">Skyline Bridge Retrofitting</h1>
          </div>
          <span className="border-2 border-black bg-[#dbe6fb] text-blue-700 px-3 py-1.5 text-xs font-bold uppercase shrink-0">
            Project ID: SKL-442
          </span>
        </div>
        <p className="mt-3 text-gray-600 max-w-2xl leading-6">
          Structural analysis and carbon-fiber reinforcement of the 1960s bypass bridge over the
          central valley corridor. Addressing critical shear stress points identified in the Q3
          survey.
        </p>

        <div className="flex flex-wrap gap-10 mt-6 pt-6 border-t-2 border-black">
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Budget</p>
            <p className="font-bold text-lg">$120k - $150k</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Deadline</p>
            <p className="font-bold text-lg">Nov 15, 2024</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Status</p>
            <p className="font-bold text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#fef08a] border border-black" />
              In Progress
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Milestones</h2>
              <button
                type="button"
                className="flex items-center gap-2 border-2 border-black bg-[#93c5fd] hover:bg-[#7ca3ef] px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Update Progress
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.title}
                  className={`border-2 border-black p-5 ${
                    milestone.status === "COMPLETE" ? "bg-[#e5e9fb]" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`font-bold ${
                        milestone.status === "COMPLETE" ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {milestone.title}
                    </h3>
                    {milestone.status === "IN PROGRESS" && (
                      <span className="border-2 border-black bg-[#fef08a] px-2 py-0.5 text-[10px] font-bold shrink-0">
                        IN PROGRESS
                      </span>
                    )}
                  </div>

                  {milestone.status === "COMPLETE" && (
                    <p className="text-xs text-gray-500 mt-1">{milestone.date}</p>
                  )}

                  {milestone.description && (
                    <p className="text-sm text-gray-600 mt-2">{milestone.description}</p>
                  )}

                  {milestone.status === "IN PROGRESS" && (
                    <>
                      <div className="h-2.5 border-2 border-black bg-white overflow-hidden mt-4">
                        <div
                          className="h-full bg-[#86efac]"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold mt-1">
                        <span>{milestone.progress}%</span>
                        <span>Est. Completion: {milestone.estCompletion}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold mb-4">Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center gap-3 border-2 border-black p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <doc.icon className={`w-6 h-6 shrink-0 ${doc.color}`} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="relative aspect-video border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <Image
              src="https://picsum.photos/seed/skyline-bridge-project/640/480"
              alt="Skyline Bridge Retrofitting"
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover grayscale"
            />
          </div>

          <section className="bg-[#1e2333] text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 font-bold text-lg">
                <Users className="w-5 h-5" />
                Assigned Crew
              </h2>
              <span className="border-2 border-white/30 bg-[#93c5fd] text-black px-2 py-1 text-[10px] font-bold">
                {teamMembers.length} Active
              </span>
            </div>
            <div className="space-y-3 pt-3 border-t border-white/20">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 border-2 border-white/30 overflow-hidden shrink-0">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">
                      {member.name}
                      {member.role === "Civil Eng." ? ", M.Eng" : ""}
                    </p>
                    <p className="text-xs text-white/60">
                      {member.role === "Civil Eng." ? "Lead Structural Eng" : "Material Specialist"} •{" "}
                      {member.experienceYears} Yrs Exp
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full mt-5 border-2 border-white bg-transparent hover:bg-white hover:text-black py-3 font-bold text-xs uppercase transition-colors"
            >
              Request Personnel →
            </button>
          </section>

          <section className="bg-[#fef08a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase underline decoration-2 underline-offset-4 mb-3">
              System Log
            </h2>
            <ul className="space-y-1.5 text-xs">
              <li>[10:42] MATERIAL DELIVERED: Carbon Fiber spools x12 to Site A.</li>
              <li>[09:15] LOG UPDATE: Phase 2 progress marked at 65% by S. Jenkins.</li>
              <li className="text-red-600 font-bold">
                [08:00] ALERT: High wind advisory. Scaffolding operations suspended.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
