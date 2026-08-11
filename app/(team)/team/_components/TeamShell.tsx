import { JetBrains_Mono } from "next/font/google";
import Sidebar from "./Sidebar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export default function TeamShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex h-screen overflow-hidden bg-[#f3f4f6] ${jetbrainsMono.className}`}>
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
