import Image from "next/image";
import Link from "next/link";
import { Rocket, UserPlus, X, Check } from "lucide-react";
import { teamMembers } from "../_data";

const opportunities = [
  {
    slug: "skyline-bridge-retrofitting",
    urgency: "URGENT",
    urgencyClass: "bg-orange-400 text-white",
    priceRange: "$120k - $150k",
    title: "Skyline Bridge Retrofitting",
    client: "Metro Gov. Infrastructure",
    description:
      "Structural analysis and carbon-fiber reinforcement of the 1960s bypass bridge over the central valley corridor.",
  },
  {
    slug: "giga-factory-phase-4",
    urgency: "INDUSTRIAL",
    urgencyClass: "bg-[#fef08a] text-black",
    priceRange: "$45k / Month",
    title: "Giga-Factory Phase 4",
    client: "Tesla-Nvidia Joint",
    description:
      "Supervising the installation of heavy robotic gantries and seismic vibration dampening systems for high-precision manufacturing.",
  },
];

export default function TeamOverviewPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <span className="inline-block border-2 border-black bg-[#4d4522] text-white px-3 py-1 text-xs font-bold uppercase">
          Vanguard Unit
        </span>
        <h1 className="text-4xl font-black mt-3">Apex Structural Group</h1>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-3">
          <p className="text-gray-600 max-w-xl leading-6">
            Pioneering modular skyscrapers and sustainable infrastructure since 2018. Engineering
            the future with precision and raw brutalist integrity.
          </p>
          <div className="flex gap-8 shrink-0">
            <div className="pr-8 border-r-2 border-black">
              <p className="text-[10px] font-bold uppercase text-gray-500">Active Projects</p>
              <p className="text-3xl font-black">12</p>
            </div>
            <div className="pr-8 border-r-2 border-black">
              <p className="text-[10px] font-bold uppercase text-gray-500">Team Size</p>
              <p className="text-3xl font-black">48</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500">Open Apps</p>
              <p className="text-3xl font-black">09</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold">Project Opportunities</h2>
              </div>
              <Link
                href="/team/marketplace"
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Browse All Requests
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {opportunities.map((project) => (
                <article
                  key={project.slug}
                  className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase ${project.urgencyClass}`}
                    >
                      {project.urgency}
                    </span>
                    <span className="text-blue-600 font-bold text-sm">{project.priceRange}</span>
                  </div>
                  <h3 className="font-bold text-xl leading-tight">{project.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Client: {project.client}</p>
                  <p className="text-sm text-gray-600 flex-1 mb-6">{project.description}</p>
                  <Link
                    href="/team/project"
                    className="w-full border-2 border-black bg-[#93c5fd] hover:bg-[#7ca3ef] py-3 font-bold text-sm uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    Review &amp; Apply
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="flex items-center justify-between bg-black text-white px-6 py-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <h2 className="font-bold text-sm uppercase">Recruitment Hub</h2>
              </div>
              <span className="border-2 border-white/40 bg-[#93c5fd] text-black px-2 py-1 text-[10px] font-bold">
                {teamMembers.length} Pending
              </span>
            </div>
            <div className="bg-white divide-y-2 divide-black">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-5">
                  <div className="relative w-12 h-12 border-2 border-black overflow-hidden shrink-0">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      unoptimized
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">
                      {member.name}
                      {member.role === "Civil Eng." ? ", M.Eng" : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.role} • {member.experienceYears} Yrs Exp • {member.location}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={`Reject ${member.name}`}
                      className="w-9 h-9 border-2 border-black bg-red-100 hover:bg-red-200 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Accept ${member.name}`}
                      className="w-9 h-9 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="relative aspect-[4/3] border-b-4 border-black">
              <Image
                src="https://picsum.photos/seed/apex-structural/640/480"
                alt="Apex Structural Group"
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover grayscale"
              />
            </div>
            <div className="p-6">
              <h3 className="font-black text-xl leading-tight">Apex Structural</h3>
              <p className="text-blue-600 font-bold text-sm mt-1">
                Certified Heavy Industries Partner
              </p>

              <p className="text-[10px] font-bold uppercase text-gray-500 mt-4 mb-2">
                Specialized Fields
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Civil Engineering", "Infrastructure", "Seismic", "High-Rise"].map((field) => (
                  <span
                    key={field}
                    className="border-2 border-black px-2 py-1 text-[10px] font-bold uppercase bg-gray-50"
                  >
                    {field}
                  </span>
                ))}
              </div>

              <div className="border-t-2 border-black pt-4 space-y-1 text-sm text-gray-600">
                <p>Global / Remote Capable</p>
                <p>Verified by Enginex Alpha</p>
              </div>

              <Link
                href="/team/profile"
                className="mt-6 w-full flex items-center justify-center gap-2 border-2 border-black bg-black text-white hover:bg-gray-900 py-3 font-bold text-xs uppercase transition-colors"
              >
                View Public Profile
              </Link>
            </div>
          </section>

          <section className="bg-[#fef08a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-sm uppercase underline decoration-2 underline-offset-4 mb-3">
              System Log
            </h2>
            <ul className="space-y-1.5 text-sm">
              <li>• BID SUBMITTED: Waterfront Pier 2</li>
              <li>• NEW APPLICANT: Sarah Jenkins</li>
              <li>• PROJECT CLOSED: North Rail Link</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
