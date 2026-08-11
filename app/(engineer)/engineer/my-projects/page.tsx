import Image from "next/image";
import { TrendingUp, Hourglass, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Active Assignments", value: "12", color: "bg-[#93c5fd]", icon: TrendingUp },
  { label: "Pending Bids", value: "04", color: "bg-[#fef08a]", icon: Hourglass },
  { label: "Completed Reviews", value: "89", color: "bg-white", icon: CheckCircle2 },
];

const activeProjects = [
  {
    title: "Bridge Structural Analysis",
    client: "Urban Infrastructure Group",
    category: "STRUCTURAL",
    progress: 75,
    progressColor: "bg-[#93c5fd]",
    deadline: "Oct 24, 2023",
    image: "https://picsum.photos/seed/bridge-structural/640/280",
  },
  {
    title: "HVAC Plant Design",
    client: "Vertigo Data Centers",
    category: "MECHANICAL",
    progress: 32,
    progressColor: "bg-[#fef08a]",
    deadline: "Nov 12, 2023",
    image: "https://picsum.photos/seed/industrial-hvac/640/280",
  },
];

const applications = [
  {
    project: "Solar Farm Layout Optimization",
    client: "EcoPower Solutions",
    bid: "$8,500",
    status: "INTERVIEWING",
    statusColor: "bg-[#fef08a] text-black",
  },
  {
    project: "Aerodynamics Simulation - V2",
    client: "AeroTech Systems",
    bid: "$12,000",
    status: "UNDER REVIEW",
    statusColor: "bg-gray-200 text-black",
  },
  {
    project: "Water Purification Pipeline",
    client: "CleanCity Water",
    bid: "$15,400",
    status: "SHORTLISTED",
    statusColor: "bg-[#93c5fd] text-black",
  },
];

export default function MyProjectsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-600">{stat.label}</p>
              <p className="text-4xl font-black mt-1">{stat.value}</p>
            </div>
            <stat.icon className="w-6 h-6" />
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Active Projects</h2>
          <button
            type="button"
            className="border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {activeProjects.map((project) => (
            <article
              key={project.title}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              <div className="relative aspect-[16/7] border-b-4 border-black">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">
                  {project.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl leading-tight">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Client: {project.client}</p>

                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2.5 border-2 border-black bg-white overflow-hidden mb-4">
                  <div
                    className={`h-full ${project.progressColor}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mb-4">Deadline: {project.deadline}</p>

                <button
                  type="button"
                  className="mt-auto w-full border-2 border-black bg-[#93c5fd] hover:bg-[#7ca3ef] py-3 font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Open Workspace
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black mb-6">Submitted Applications</h2>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-4 border-black">
                <th className="px-6 py-4 text-xs font-bold uppercase">Project Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Bid Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr
                  key={application.project}
                  className={index !== applications.length - 1 ? "border-b-2 border-black" : ""}
                >
                  <td className="px-6 py-5 font-bold">{application.project}</td>
                  <td className="px-6 py-5 text-gray-600">{application.client}</td>
                  <td className="px-6 py-5 font-mono">{application.bid}</td>
                  <td className="px-6 py-5">
                    <span
                      className={`border-2 border-black px-2 py-1 text-[10px] font-bold uppercase ${application.statusColor}`}
                    >
                      {application.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
