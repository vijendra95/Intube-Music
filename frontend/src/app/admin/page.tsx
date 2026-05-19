"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Wifi, CreditCard, Activity, Video, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStreams: 0,
    totalRevenue: 0,
    totalVideos: 0,
    newUsersToday: 0,
    activeSubscriptions: 0,
    totalStorage: 0,
    streamErrors: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const data = await api("/admin/stats");
      setStats(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Active Streams", value: stats.activeStreams, icon: Wifi, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Revenue (MTD)", value: `₹${stats.totalRevenue}`, icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Total Videos", value: stats.totalVideos, icon: Video, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-gray-500">Platform statistics and health</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-400" /> Stream Health
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-lg p-3">
              <span className="text-sm text-gray-300">Active Streams</span>
              <span className="text-sm font-medium text-green-400">{stats.activeStreams}</span>
            </div>
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-lg p-3">
              <span className="text-sm text-gray-300">Stream Errors (24h)</span>
              <span className="text-sm font-medium text-amber-400">{stats.streamErrors}</span>
            </div>
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-lg p-3">
              <span className="text-sm text-gray-300">Uptime</span>
              <span className="text-sm font-medium text-green-400">99.9%</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" /> Today
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-lg p-3">
              <span className="text-sm text-gray-300">New Users</span>
              <span className="text-sm font-medium">{stats.newUsersToday}</span>
            </div>
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-lg p-3">
              <span className="text-sm text-gray-300">Active Subscriptions</span>
              <span className="text-sm font-medium">{stats.activeSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-lg p-3">
              <span className="text-sm text-gray-300">Storage Used</span>
              <span className="text-sm font-medium">{(stats.totalStorage / (1024*1024*1024)).toFixed(2)} GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
