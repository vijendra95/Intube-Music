"use client";

import { Upload, Video, Info } from "lucide-react";

export default function VideosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Video Gallery</h1>
        <p className="text-gray-400">Upload and manage your videos for live streaming</p>
      </div>

      {/* Upload Area */}
      <div className="glass rounded-xl p-8 mb-6 border-2 border-dashed border-gray-700 hover:border-cyan-500/50 transition cursor-pointer text-center">
        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-2">Drag and drop your video here</h3>
        <p className="text-gray-400 text-sm mb-4">
          Supports MP4, MOV, AVI, WebM (remaining: 1 GB of 1 GB)
        </p>
        <label className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-medium cursor-pointer transition">
          <Upload className="w-4 h-4" /> Choose File
          <input type="file" accept="video/*" className="hidden" />
        </label>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          You can upload total 2GB for each active slot. Video processing can take 10-15 minutes
          depending on size and duration.
        </p>
      </div>

      {/* Videos List */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-bold text-lg mb-4">Your Videos (0)</h2>
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300 mb-1">No videos yet</h3>
          <p className="text-gray-500 text-sm">Upload your first video to get started</p>
        </div>
      </div>
    </div>
  );
}
