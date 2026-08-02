"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (["/client/browse-engineers", "/client/my-projects", "/client/profile"].includes(pathname) || pathname.startsWith("/client/marketplace/")) return children;

  return <div className="flex min-h-screen bg-[#f3f4f6]"><Sidebar/><div className="flex flex-1 flex-col"><Header/><main className="flex-1 overflow-auto">{children}</main></div></div>;
}
