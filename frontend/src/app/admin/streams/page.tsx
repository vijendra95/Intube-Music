"use client";

import { useState, useEffect, useCallback } from "react";
import { Wifi, Play, Square, Trash2, Search } from "lucide-react";
import { api } from "@/lib/api";

interface StreamItem {
  _id: string;
  title: string;
  platform: string;
  quality: string;
  mode: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminStreamsPage() {
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [search, setSearch] = useState("");

  const fetchStreams = useCallback(async () => {
    try {
      const data = await api(`/admin/streams?search=${search}`);
      setStreams(data.streams);
    } catch {
      // silent
    }
  }, [search]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const handleStart = async (id: string) => {
    try {
      await api(`/admin/streams/${id}/start`, { method: "POST" });
      fetchStreams();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleStop = async (id: string) => {
    try {
      await api(`/admin/streams/${id}/stop`, { method: "POST" });
      fetchStreams();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stream?")) return;
    try {
      await api(`/admin/streams/${id}`, { method: "DELETE" });
      fetchStreams();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Streams</h1>
          <p className="text-gray-500">Monitor and manage all user streams</p>
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

      {streams.length === 0 ? (
        <div className="card p-12 text-center">
          <Wifi className="w-14 h-14 text-purple-900/50 mx-auto mb-3" />
          <p className="text-gray-500">No streams found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {streams.map((stream) => (
            <div key={stream._id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stream.status === "live" ? "bg-green-500/10 border border-green-500/30" : "bg-purple-500/10 border border-purple-500/20"
                }`}>
                  <Wifi className={`w-5 h-5 ${stream.status === "live" ? "text-green-400" : "text-purple-400"}`} />
                </div>
                <div>
                  <p className="font-medium">{stream.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="text-purple-400">{stream.user?.name || "Unknown"}</span>
                    <span className="capitalize">{stream.platform}</span>
                    <span>{stream.quality}</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      stream.status === "live" ? "bg-green-500/10 text-green-400" :
                      stream.status === "starting" ? "bg-amber-500/10 text-amber-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>{stream.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stream.status === "live" ? (
                  <button onClick={() => handleStop(stream._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => handleStart(stream._id)} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(stream._id)} className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
