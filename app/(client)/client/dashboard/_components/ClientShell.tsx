import { JetBrains_Mono } from "next/font/google";
import Header from "./Header";
import Sidebar from "./Sidebar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

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
