"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
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
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <div className="text-purple-400 animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const storageUsed = user.storage?.used || 0;
  const storageLimit = user.storage?.limit || 1073741824;
  const storageMB = (storageUsed / (1024 * 1024)).toFixed(0);
  const storageLimitGB = (storageLimit / (1024 * 1024 * 1024)).toFixed(0);

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
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 font-medium capitalize">
              {user.plan} Plan
            </span>
            <span className="text-xs text-gray-600">{storageMB}MB / {storageLimitGB}GB</span>
          </div>
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 w-full transition"
          >
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
