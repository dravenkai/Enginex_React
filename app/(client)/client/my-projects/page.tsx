import Link from "next/link";
import { Plus } from "lucide-react";

const statusColors = {
  "IN PROGRESS": "bg-[#93c5fd] text-black",
  COMPLETED: "bg-green-300 text-black",
  PENDING: "bg-[#fef08a] text-black",
} as const;

const projects = [
  { name: "Office Building Renovation", engineer: "Sarah Johnson", status: "IN PROGRESS", budget: "$45,000" },
  { name: "Bridge Inspection Report", engineer: "David Kumar", status: "COMPLETED", budget: "$12,500" },
  { name: "HVAC System Design", engineer: "Michael Chen", status: "PENDING", budget: "$28,000" },
] as const;

export default function MyProjectsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Active Projects</h2>
        <Link
          href="/client/request"
          className="flex items-center gap-2 px-5 py-3 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] font-bold text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <div className="space-y-5">
        {projects.map((project) => (
          <article
            key={project.name}
            className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-bold text-lg mb-2">{project.name}</h3>
              <div className="flex items-center gap-3">
                <span
                  className={`border-2 border-black px-2 py-0.5 text-[10px] font-bold ${statusColors[project.status]}`}
                >
                  {project.status}
                </span>
                <p className="text-sm text-gray-500 font-medium">Engineer: {project.engineer}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <strong className="border-2 border-black px-3 py-2 bg-[#fef08a] text-sm font-mono">
                {project.budget}
              </strong>
              <button
                type="button"
                className="h-11 px-4 border-2 border-black bg-white font-bold text-xs uppercase hover:bg-gray-100 transition-colors"
              >
                View Details
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
