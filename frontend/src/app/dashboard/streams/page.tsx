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
          <p className="text-gray-400">Manage your live streaming sessions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" /> New Stream
        </button>
      </div>

      {/* Empty State */}
      <div className="glass rounded-xl p-12 text-center">
        <Wifi className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No streams yet</h3>
        <p className="text-gray-500 mb-6">Create your first live stream to get started</p>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" /> Create Stream
        </button>
      </div>

      {/* Create Stream Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Stream</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                  Stream Title
                </label>
                <input
                  type="text"
                  placeholder="My 24/7 Stream"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                  Primary Platform
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitch">Twitch</option>
                  <option value="custom">Custom RTMP</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                  Primary Stream Key
                </label>
                <input
                  type="password"
                  placeholder="Paste your stream key here"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
                <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                  <Shield className="w-3.5 h-3.5" /> Your stream key is encrypted and stored securely
                </p>
              </div>

              <div className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium">Extra Destinations (Multi-Platform)</span>
                  </div>
                  <button
                    type="button"
                    className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded hover:bg-cyan-500/20 transition"
                  >
                    + Add
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Same video will stream to multiple platforms simultaneously. Add extra RTMP keys here.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Quality</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                  <option value="720p">HD 720p</option>
                  <option value="1080p">Full HD 1080p</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Stream Mode</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
                  <option value="loop">Loop (24/7 Repeat)</option>
                  <option value="once">One-Time Play</option>
                </select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Loop mode auto-restarts if stream drops. One-time plays videos once and stops.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                  Select Videos
                </label>
                <p className="text-sm text-gray-500">No videos available. Upload videos first.</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium transition"
                >
                  Create Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
