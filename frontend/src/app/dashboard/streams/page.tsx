"use client";

import { useState } from "react";
import { Wifi, Plus, X, Shield, Globe } from "lucide-react";

export default function StreamsPage() {
  const [showModal, setShowModal] = useState(false);

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

      {/* Empty State */}
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

            <form className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Stream Title</label>
                <input
                  type="text"
                  placeholder="My 24/7 Live Stream"
                  className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Platform</label>
                <select className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition">
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
                  placeholder="Paste your stream key"
                  className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
                <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1.5">
                  <Shield className="w-3 h-3" /> Encrypted & stored securely
                </p>
              </div>

              <div className="bg-[#0f0a1e] border border-purple-900/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">Multi-Platform</span>
                  </div>
                  <button
                    type="button"
                    className="text-xs gradient-bg text-white px-3 py-1 rounded-full font-medium"
                  >
                    + Add
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">Stream to multiple platforms at once</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Quality</label>
                  <select className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition">
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Mode</label>
                  <select className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition">
                    <option value="loop">Loop 24/7</option>
                    <option value="once">Play Once</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Videos</label>
                <p className="text-sm text-gray-600">No videos yet. Upload videos first.</p>
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
                  className="flex-1 gradient-bg hover:opacity-90 text-white py-3 rounded-xl font-medium transition shadow-lg shadow-purple-500/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
