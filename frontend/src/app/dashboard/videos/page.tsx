"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Video, Trash2, HardDrive } from "lucide-react";
import { api, uploadFile } from "@/lib/api";

interface VideoItem {
  _id: string;
  title: string;
  originalName: string;
  size: number;
  status: string;
  createdAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      const data = await api("/videos");
      setVideos(data.videos);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    const allowed = ["video/mp4", "video/quicktime", "video/avi", "video/webm", "video/x-msvideo"];
    if (!allowed.includes(file.type)) {
      setError("Only MP4, MOV, AVI, WebM formats allowed");
      return;
    }

    setError("");
    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
      await uploadFile("/videos/upload", formData);
      setUploadProgress("Upload complete!");
      fetchVideos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await api(`/videos/${id}`, { method: "DELETE" });
      fetchVideos();
    } catch {
      setError("Failed to delete video");
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
          <h1 className="text-2xl font-bold">Video Gallery</h1>
          <p className="text-gray-500">Upload and manage your videos</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
        className={`card p-10 text-center mb-6 border-2 border-dashed transition cursor-pointer ${
          dragOver ? "border-purple-500 bg-purple-500/5" : "border-purple-900/30"
        }`}
      >
        <Upload className="w-12 h-12 text-purple-500/50 mx-auto mb-3" />
        <p className="text-gray-300 mb-2 font-medium">
          {uploading ? uploadProgress : "Drag & drop video or click to upload"}
        </p>
        <p className="text-gray-600 text-xs mb-4">MP4, MOV, AVI, WebM — Max 2GB per file</p>
        <label className="inline-flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium cursor-pointer transition shadow-lg shadow-purple-500/20">
          <Upload className="w-4 h-4" /> Choose File
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/avi,video/webm"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Videos List */}
      {videos.length === 0 ? (
        <div className="card p-12 text-center">
          <Video className="w-14 h-14 text-purple-900/50 mx-auto mb-3" />
          <p className="text-gray-500">No videos uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video._id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">{video.title || video.originalName}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{formatSize(video.size)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      video.status === "ready" ? "bg-green-500/10 text-green-400" :
                      video.status === "processing" ? "bg-amber-500/10 text-amber-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>{video.status}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(video._id)}
                className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
