import {
  Video,
  Wifi,
  HardDrive,
  Radio,
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
        <p className="text-gray-400">Overview of your streaming activity</p>
      </div>

      {/* Plan Card */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Your Plan</p>
              <h3 className="font-bold text-lg">Free Plan</h3>
            </div>
          </div>
          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">Free</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <HardDrive className="w-4 h-4" /> Storage
            </div>
            <p className="font-semibold">0 Bytes / 1 GB</p>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Wifi className="w-4 h-4" /> Live Streams
            </div>
            <p className="font-semibold">0 / 1 slots</p>
            <p className="text-xs text-gray-500 mt-1">1 available</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Monitor className="w-4 h-4" /> Quality
            </div>
            <p className="font-semibold">720p</p>
            <p className="text-xs text-gray-500 mt-1">HD only</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Clock className="w-4 h-4" /> Stream Hours
            </div>
            <p className="font-semibold">2h / day</p>
            <p className="text-xs text-gray-500 mt-1">Daily limit</p>
          </div>
        </div>
        <Link
          href="/dashboard/subscription"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4 transition"
        >
          <Zap className="w-4 h-4" /> Upgrade Plan
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-400">Total Videos</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Wifi className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">0 / 1</p>
            <p className="text-xs text-gray-400">Active Streams</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">0 B</p>
            <p className="text-xs text-gray-400">Storage Used</p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Radio className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-400">Total Streams</p>
          </div>
        </div>
      </div>

      {/* Active Streams & Recent Videos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Active Streams</h2>
            <Link href="/dashboard/streams" className="text-sm text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>
          <div className="text-center py-8">
            <Wifi className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No active streams</p>
            <Link
              href="/dashboard/streams"
              className="inline-block mt-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Start a Stream
            </Link>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Recent Videos</h2>
            <Link href="/dashboard/videos" className="text-sm text-cyan-400 hover:text-cyan-300">
              View all →
            </Link>
          </div>
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No videos uploaded yet</p>
            <Link
              href="/dashboard/videos"
              className="inline-block mt-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Upload Video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
