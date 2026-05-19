"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import {
  Tv,
  LayoutDashboard,
  Users,
  Wifi,
  Video,
  CreditCard,
  Receipt,
  Gift,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/streams", icon: Wifi, label: "Streams" },
  { href: "/admin/videos", icon: Video, label: "Videos" },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { href: "/admin/payments", icon: Receipt, label: "Payments" },
  { href: "/admin/referrals", icon: Gift, label: "Referrals" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
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

  if (!user || user.role !== "admin") return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#130e24] border-r border-purple-900/30 flex flex-col fixed h-full">
        <div className="p-5 border-b border-purple-900/30">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Admin<span className="text-amber-400">Panel</span>
            </span>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-red-400 font-medium">Super Admin</p>
            </div>
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
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1333]"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-purple-900/30 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-purple-300 hover:bg-purple-500/10 w-full transition"
          >
            <Tv className="w-[18px] h-[18px]" />
            User Dashboard
          </Link>
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
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Admin Mode</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
