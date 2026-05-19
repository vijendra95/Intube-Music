"use client";

import { useState, useEffect, useCallback } from "react";
import { Video, Trash2, Search, HardDrive } from "lucide-react";
import { api } from "@/lib/api";

interface VideoItem {
  _id: string;
  title: string;
  originalName: string;
  size: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [search, setSearch] = useState("");

  const fetchVideos = useCallback(async () => {
    try {
      const data = await api(`/admin/videos?search=${search}`);
      setVideos(data.videos);
    } catch {
      // silent
    }
  }, [search]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await api(`/admin/videos/${id}`, { method: "DELETE" });
      fetchVideos();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Videos</h1>
          <p className="text-gray-500">Manage all uploaded videos across users</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or user..."
          className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
        />
      </div>

      {videos.length === 0 ? (
        <div className="card p-12 text-center">
          <Video className="w-14 h-14 text-purple-900/50 mx-auto mb-3" />
          <p className="text-gray-500">No videos found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-900/30">
                <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Video</th>
                <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">User</th>
                <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Size</th>
                <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Status</th>
                <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Date</th>
                <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v._id} className="border-b border-purple-900/20 hover:bg-purple-500/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Video className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium truncate max-w-[200px]">{v.title || v.originalName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{v.user?.name || "Unknown"}</td>
                  <td className="py-3 px-4 text-sm flex items-center gap-1 text-gray-400">
                    <HardDrive className="w-3 h-3" />{formatSize(v.size)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      v.status === "ready" ? "bg-green-500/10 text-green-400" :
                      v.status === "processing" ? "bg-amber-500/10 text-amber-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>{v.status}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(v.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(v._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
