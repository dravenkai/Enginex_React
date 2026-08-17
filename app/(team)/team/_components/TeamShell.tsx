import { jetbrainsMono } from "@/lib/fonts";
import Sidebar from "./Sidebar";

export default function TeamShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex h-screen overflow-hidden bg-[#f3f4f6] ${jetbrainsMono.className}`}>
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
