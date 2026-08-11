"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Store, Briefcase, User, LogOut } from "lucide-react";
import { logout } from "@/lib/auth/api";
import { useAuthStore } from "@/lib/auth/store";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/engineer/dashboard" },
  { name: "Marketplace", icon: Store, href: "/engineer/marketplace" },
  { name: "My Projects", icon: Briefcase, href: "/engineer/my-projects" },
  { name: "Profile", icon: User, href: "/engineer/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clear);

  async function handleLogout() {
    clearSession();
    router.push("/login");
    try {
      await logout();
    } catch {
      // Session is already cleared client-side; ignore network errors here.
    }
  }

  return (
    <div className="w-64 h-full flex-shrink-0 bg-white border-r-4 border-black flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <Image src="/enginex-logo.png" alt="Enginex logo" width={40} height={40} />
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-tight">Enginex</span>
          <span className="text-xs font-medium text-gray-500">Engineer Site</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 font-semibold transition-all ${
                isActive
                  ? "bg-[#fef08a] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 font-semibold text-gray-700 hover:bg-gray-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
