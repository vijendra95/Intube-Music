"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, Video, Wifi, HardDrive, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ videos: 0, activeStreams: 0, storageUsed: 0, streamSlots: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const data = await api("/users/dashboard");
      setStats(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const storageLimit = user?.storage?.limit || 1073741824;
  const storagePercent = Math.round((stats.storageUsed / storageLimit) * 100);

  const statCards = [
    { label: "Videos", value: stats.videos, icon: Video, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Active Streams", value: stats.activeStreams, icon: Wifi, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Storage", value: `${(stats.storageUsed / (1024 * 1024)).toFixed(0)}MB`, icon: HardDrive, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Stream Slots", value: stats.streamSlots || user?.streamSlots || 1, icon: Clock, color: "text-pink-400", bg: "bg-pink-500/10" },
  ];

  return (
    <div>
      {/* Plan Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg capitalize">{user?.plan || "Free"} Plan</h2>
              <p className="text-xs text-gray-500">Your current subscription</p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="text-sm text-purple-400 hover:text-purple-300 border border-purple-500/30 px-4 py-1.5 rounded-full transition"
          >
            Upgrade
          </Link>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Storage</span>
            <span className="text-gray-400">{storagePercent}%</span>
          </div>
          <div className="w-full bg-[#0f0a1e] rounded-full h-2">
            <div className="gradient-bg h-2 rounded-full transition-all" style={{ width: `${storagePercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/dashboard/videos" className="card card-hover p-6 group">
          <Video className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition" />
          <h3 className="font-semibold mb-1">Upload Videos</h3>
          <p className="text-sm text-gray-500">Add videos to your gallery for streaming</p>
        </Link>
        <Link href="/dashboard/streams" className="card card-hover p-6 group">
          <Wifi className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition" />
          <h3 className="font-semibold mb-1">Start Streaming</h3>
          <p className="text-sm text-gray-500">Go live on YouTube, Facebook, or Twitch</p>
        </Link>
      </div>
    </div>
  );
}
