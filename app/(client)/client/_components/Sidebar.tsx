"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Heart, User, Plus } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/client/dashboard" },
  { name: "Marketplace", icon: ShoppingCart, href: "/client/marketplace" },
  { name: "Favorites", icon: Heart, href: "/client/favorites" },
  { name: "Profile", icon: User, href: "/client/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r-4 border-black flex flex-col">
      <div className="p-6 border-b-4 border-black flex items-center gap-2">
        <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center">
          <Image src="/next.svg" alt="Enginex logo" width={24} height={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-tight">Enginex</span>
          <span className="text-xs font-medium text-gray-500">Client Site</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 font-bold border-2 border-transparent transition-all ${
                isActive
                  ? "bg-[#93c5fd] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-4 border-black bg-[#fef08a]">
        <Link
          href="/client/dashboard/new-request"
          className="w-full flex items-center justify-center gap-2 p-3 font-bold border-2 border-black bg-transparent hover:bg-black hover:text-[#fef08a] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider"
        >
          <Plus className="w-5 h-5" />
          New Request
        </Link>
      </div>
    </div>
  );
}
