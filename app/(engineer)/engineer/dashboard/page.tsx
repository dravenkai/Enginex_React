import Image from "next/image";
import { List, Gauge } from "lucide-react";

const statusColors = {
  MATCHING: "bg-[#fef08a] text-black",
  "IN PROGRESS": "bg-[#f2784a] text-white",
  "FINAL REVIEW": "bg-[#93c5fd] text-black",
} as const;

const requests = [
  {
    id: "REQ-4021",
    title: "Cloud Migration Strategy",
    status: "MATCHING",
    description: "Azure to AWS transition for high-traffic e-commerce...",
    pendingCount: 5,
    actionLabel: "MANAGE",
  },
  {
    id: "REQ-3892",
    title: "Python Security Audit",
    status: "IN PROGRESS",
    description: "Pentesting core API endpoints and SQL optimization...",
    engineerAvatar: "/profile.avif",
    engineerName: "Sarah L.",
    actionLabel: "MESSAGE",
  },
  {
    id: "REQ-3770",
    title: "React Frontend Refactor",
    status: "FINAL REVIEW",
    description: "Implementing new Design System tokens and hooks...",
    engineerAvatar: "/profile.avif",
    engineerName: "Mike T.",
    actionLabel: "APPROVE",
  },
] as const;

export default function EngineerDashboardPage() {
  return (
    <div className="p-8 space-y-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center min-h-[200px]">
          <h1 className="text-3xl font-bold mb-4">Welcome back, Khant Nyar.</h1>
          <p className="text-gray-600 max-w-md font-medium text-sm">
            You have 3 active requests and 12 engineers are currently reviewing your latest post.
            Everything is running smoothly.
          </p>
        </div>
        <div className="bg-[#fef08a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center h-full">
          <div className="bg-black text-white p-3 rounded-full mb-4">
            <Gauge className="w-8 h-8" />
          </div>
          <span className="text-md font-medium uppercase tracking-widest mb-1">System Status</span>
          <span className="text-base font-medium uppercase">Optimized</span>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl font-bold">Active Requests</h2>
          </div>
          <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
            View All
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request) => (
            <article
              key={request.id}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`${statusColors[request.status]} border-2 border-black px-2 py-0.5 text-[10px] font-bold`}
                >
                  {request.status}
                </span>
                <span className="text-gray-400 text-xs font-medium">#{request.id}</span>
              </div>

              <h3 className="text-xl font-bold mb-2 leading-tight">{request.title}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-1">{request.description}</p>

              <div className="border-t-2 border-black pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {"engineerAvatar" in request ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 border-2 border-black overflow-hidden relative">
                        <Image
                          src={request.engineerAvatar}
                          alt={request.engineerName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold">{request.engineerName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center -space-x-2">
                      <div className="w-8 h-8 border-2 border-black bg-zinc-800 rounded-full" />
                      <div className="w-8 h-8 border-2 border-black bg-white rounded-full flex items-center justify-center text-[10px] font-bold">
                        +{request.pendingCount}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-tighter cursor-pointer">
                  {request.actionLabel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
