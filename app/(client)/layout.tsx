import { JetBrains_Mono } from "next/font/google";
import Sidebar from "./client/_components/Sidebar";
import Header from "./client/_components/Header";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export default function RouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex h-screen overflow-hidden bg-[#f3f4f6] ${jetbrainsMono.className}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
