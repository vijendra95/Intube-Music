"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
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
  { href: "/dashboard/payments", icon: Receipt, label: "Payment History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <Radio className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold">
              Intube<span className="text-cyan-400">Media</span>.live
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 font-bold">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User Name</p>
              <p className="text-xs text-gray-400 truncate">user@email.com</p>
            </div>
          </div>
          <span className="inline-block mt-2 text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded px-2 py-0.5">
            Free Plan
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/videos"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Upload className="w-4 h-4" /> Upload Video
            </Link>
            <Link
              href="/dashboard/streams"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" /> New Stream
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
