"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tv,
  LayoutDashboard,
  Video,
  Wifi,
  CreditCard,
  Gift,
  Receipt,
  Settings,
  LogOut,
  Upload,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/videos", icon: Video, label: "Video Gallery" },
  { href: "/dashboard/streams", icon: Wifi, label: "Live Streams" },
  { href: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
  { href: "/dashboard/referral", icon: Gift, label: "Referral & Earn" },
  { href: "/dashboard/payments", icon: Receipt, label: "Payments" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#130e24] border-r border-purple-900/30 flex flex-col fixed h-full">
        <div className="p-5 border-b border-purple-900/30">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              intube<span className="text-purple-400">media</span>
            </span>
          </Link>
        </div>

        {/* User */}
        <div className="p-4 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User Name</p>
              <p className="text-xs text-gray-500 truncate">user@email.com</p>
            </div>
          </div>
          <span className="inline-block mt-2.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 font-medium">
            Free Plan
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1333]"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-purple-900/30">
          <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 w-full transition">
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 bg-[#0f0a1e]/80 backdrop-blur-xl border-b border-purple-900/30 px-6 py-3 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/videos"
              className="flex items-center gap-2 bg-[#1a1333] hover:bg-[#251d40] border border-purple-900/50 text-white px-4 py-2 rounded-full text-sm transition"
            >
              <Upload className="w-4 h-4" /> Upload
            </Link>
            <Link
              href="/dashboard/streams"
              className="flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-lg shadow-purple-500/20"
            >
              <Plus className="w-4 h-4" /> New Stream
            </Link>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
