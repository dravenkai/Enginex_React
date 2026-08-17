import { jetbrainsMono } from "@/lib/fonts";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex h-screen overflow-hidden bg-[#f3f4f6] ${jetbrainsMono.className}`}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
