import {
  Video,
  Wifi,
  HardDrive,
  Tv,
  Zap,
  Monitor,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Overview of your streaming activity</p>
      </div>

      {/* Plan Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Current Plan</p>
              <h3 className="font-bold text-lg">Free Plan</h3>
            </div>
          </div>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-medium">Free</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0f0a1e] rounded-xl p-3.5 border border-purple-900/30">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <HardDrive className="w-3.5 h-3.5" /> Storage
            </div>
            <p className="font-semibold text-sm">0 / 1 GB</p>
            <div className="w-full bg-purple-900/30 rounded-full h-1.5 mt-2">
              <div className="gradient-bg h-1.5 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </div>
          <div className="bg-[#0f0a1e] rounded-xl p-3.5 border border-purple-900/30">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <Wifi className="w-3.5 h-3.5" /> Slots
            </div>
            <p className="font-semibold text-sm">0 / 1</p>
            <p className="text-[11px] text-gray-600 mt-1">1 available</p>
          </div>
          <div className="bg-[#0f0a1e] rounded-xl p-3.5 border border-purple-900/30">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <Monitor className="w-3.5 h-3.5" /> Quality
            </div>
            <p className="font-semibold text-sm">720p HD</p>
            <p className="text-[11px] text-gray-600 mt-1">Standard def</p>
          </div>
          <div className="bg-[#0f0a1e] rounded-xl p-3.5 border border-purple-900/30">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <Clock className="w-3.5 h-3.5" /> Daily
            </div>
            <p className="font-semibold text-sm">2h / day</p>
            <p className="text-[11px] text-gray-600 mt-1">Limit</p>
          </div>
        </div>
        <Link
          href="/dashboard/subscription"
          className="inline-flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-5 py-2.5 rounded-full text-sm font-medium mt-5 transition shadow-lg shadow-purple-500/20"
        >
          <Zap className="w-4 h-4" /> Upgrade Plan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-xl font-bold">0</p>
            <p className="text-[11px] text-gray-500">Videos</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
            <Wifi className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xl font-bold">0 / 1</p>
            <p className="text-[11px] text-gray-500">Active</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-bold">0 B</p>
            <p className="text-[11px] text-gray-500">Used</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center">
            <Tv className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <p className="text-xl font-bold">0</p>
            <p className="text-[11px] text-gray-500">Total Streams</p>
          </div>
        </div>
      </div>

      {/* Active Streams & Recent Videos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Active Streams</h2>
            <Link href="/dashboard/streams" className="text-xs text-purple-400 hover:text-purple-300">
              View all →
            </Link>
          </div>
          <div className="text-center py-10">
            <Wifi className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No active streams</p>
            <Link
              href="/dashboard/streams"
              className="inline-block mt-3 bg-[#1a1333] hover:bg-[#251d40] border border-purple-900/50 text-white px-4 py-2 rounded-full text-sm transition"
            >
              Start a Stream
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Videos</h2>
            <Link href="/dashboard/videos" className="text-xs text-purple-400 hover:text-purple-300">
              View all →
            </Link>
          </div>
          <div className="text-center py-10">
            <Video className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No videos uploaded</p>
            <Link
              href="/dashboard/videos"
              className="inline-block mt-3 bg-[#1a1333] hover:bg-[#251d40] border border-purple-900/50 text-white px-4 py-2 rounded-full text-sm transition"
            >
              Upload Video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
