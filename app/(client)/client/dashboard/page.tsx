﻿import WelcomeBanner from "../_components/WelcomeBanner";
import StatusCard from "../_components/StatusCard";
import RequestCard from "../_components/RequestCard";
import EngineerCard from "../_components/EngineerCard";
import { List, Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function Page() {
  return (
    <div className="p-8 space-y-12 max-w-[1400px] mx-auto">
      {/* Top Section: Welcome and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WelcomeBanner
            name="Khant Nyar"
            activeRequests={3}
            engineerCount={12}
          />
        </div>
        <div>
          <StatusCard />
        </div>
      </div>

      {/* Active Requests Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <List className="w-5 h-5 text-blue-700" />
          <h2 className="text-xl font-bold">Active Requests</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RequestCard
            id="REQ-4021"
            title="Cloud Migration Strategy"
            status="MATCHING"
            description="Azure to AWS transition for high-traffic e-commerce..."
            actionLabel="MANAGE"
          />
          <RequestCard
            id="REQ-3892"
            title="Python Security Audit"
            status="IN PROGRESS"
            description="Pentesting core API endpoints and SQL optimization..."
            engineerAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            engineerName="Sarah L."
            actionLabel="MESSAGE"
          />
          <RequestCard
            id="REQ-3770"
            title="React Frontend Refactor"
            status="FINAL REVIEW"
            description="Implementing new Design System tokens and hooks..."
            engineerAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
            engineerName="Mike T."
            actionLabel="APPROVE"
          />
        </div>
      </section>

      {/* Recommended Engineers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-700 fill-blue-700" />
            <h2 className="text-xl font-bold">Recommended Engineers</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-1 border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          <EngineerCard
            name="Pai Min Thway"
            role="Civil Engineer"
            avatar="https://api.dicebear.com/7.x/pixel-art/svg?seed=Pai"
            tags={["KUBERNETES", "TERRAFORM", "GO"]}
          />
          <EngineerCard
            name="Chaint Chaint Chan"
            role="Architect"
            avatar="https://api.dicebear.com/7.x/pixel-art/svg?seed=Chaint"
            tags={["Archi", "Draw", "Build"]}
          />
          <EngineerCard
            name="Pai Min Thway"
            role="Civil Engineer"
            avatar="https://api.dicebear.com/7.x/pixel-art/svg?seed=Pai2"
            tags={["KUBERNETES", "TERRAFORM", "GO"]}
          />
          <EngineerCard
            name="Chaint Chaint Chan"
            role="Architect"
            avatar="https://api.dicebear.com/7.x/pixel-art/svg?seed=Chaint2"
            tags={["Archi", "Draw", "Build"]}
          />
          <EngineerCard
            name="Pai Min Thway"
            role="Civil Engineer"
            avatar="https://api.dicebear.com/7.x/pixel-art/svg?seed=Pai3"
            tags={["KUBERNETES", "TERRAFORM", "GO"]}
          />
        </div>
      </section>
    </div>
  );
}
