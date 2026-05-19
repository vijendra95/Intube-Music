"use client";

import { useState, useEffect, useCallback } from "react";
import { Wifi, Plus, X, Shield, Globe, Play, Square, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

interface StreamItem {
  _id: string;
  title: string;
  platform: string;
  quality: string;
  mode: string;
  status: string;
  createdAt: string;
}

export default function StreamsPage() {
  const [showModal, setShowModal] = useState(false);
  const [streams, setStreams] = useState<StreamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    platform: "youtube",
    streamKey: "",
    rtmpUrl: "",
    quality: "720p",
    mode: "loop",
  });

  const fetchStreams = useCallback(async () => {
    try {
      const data = await api("/streams");
      setStreams(data.streams);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/streams", { method: "POST", body: form });
      setShowModal(false);
      setForm({ title: "", platform: "youtube", streamKey: "", rtmpUrl: "", quality: "720p", mode: "loop" });
      fetchStreams();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create stream");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await api(`/streams/${id}/start`, { method: "POST" });
      fetchStreams();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to start");
    }
  };

  const handleStop = async (id: string) => {
    try {
      await api(`/streams/${id}/stop`, { method: "POST" });
      fetchStreams();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to stop");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stream?")) return;
    try {
      await api(`/streams/${id}`, { method: "DELETE" });
      fetchStreams();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Live Streams</h1>
          <p className="text-gray-500">Manage your live streaming sessions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> New Stream
        </button>
      </div>

      {/* Streams List */}
      {streams.length === 0 ? (
        <div className="card p-16 text-center">
          <Wifi className="w-16 h-16 text-purple-900/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No streams yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Create your first live stream to start broadcasting</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" /> Create Stream
          </button>
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
                    <span className="capitalize">{stream.platform}</span>
                    <span>{stream.quality}</span>
                    <span className="capitalize">{stream.mode}</span>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1333] border border-purple-900/50 rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create Stream</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Stream Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="My 24/7 Live Stream"
                  required
                  className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition"
                >
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitch">Twitch</option>
                  <option value="custom">Custom RTMP</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Stream Key</label>
                <input
                  type="password"
                  value={form.streamKey}
                  onChange={(e) => setForm({ ...form, streamKey: e.target.value })}
                  placeholder="Paste your stream key from YouTube/Facebook"
                  required
                  className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
                <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1.5">
                  <Shield className="w-3 h-3" /> Encrypted & stored securely
                </p>
              </div>

              {form.platform === "custom" && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">RTMP URL</label>
                  <input
                    type="text"
                    value={form.rtmpUrl}
                    onChange={(e) => setForm({ ...form, rtmpUrl: e.target.value })}
                    placeholder="rtmp://your-server.com/live"
                    className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              )}

              <div className="bg-[#0f0a1e] border border-purple-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">Multi-Platform (coming soon)</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Stream to multiple platforms simultaneously</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Quality</label>
                  <select
                    value={form.quality}
                    onChange={(e) => setForm({ ...form, quality: e.target.value })}
                    className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition"
                  >
                    <option value="loop">Loop 24/7</option>
                    <option value="once">Play Once</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#0f0a1e] hover:bg-[#251d40] border border-purple-900/50 text-white py-3 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 gradient-bg hover:opacity-90 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Stream"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
