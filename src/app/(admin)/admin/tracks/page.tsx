'use client';

import { useState, useEffect } from 'react';

interface TrackData {
  id: string;
  title: string;
  genre: string | null;
  isPublished: boolean;
  audioOriginal: string | null;
  audioUrl128: string | null;
  playCount: number;
  createdAt: string;
  artist?: { id: string; name: string } | null;
  album?: { id: string; title: string } | null;
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTracks = () => {
    setLoading(true);
    fetch('/api/tracks?limit=100').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.tracks || []);
      setTracks(list);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadTracks(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete track "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/tracks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadTracks();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/tracks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (res.ok) {
        loadTracks();
      }
    } catch {
      alert('Network error');
    }
  };

  const getAudioUrl = (track: TrackData) => track.audioOriginal || track.audioUrl128 || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Tracks</h1>
          <p className="text-[#8888aa] mt-1">Manage all uploaded music tracks</p>
        </div>
        <a
          href="/admin/upload"
          className="px-4 py-2 bg-[var(--color-primary)] text-black font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Upload New
        </a>
      </div>

      {loading ? (
        <p className="text-[#8888aa]">Loading tracks...</p>
      ) : tracks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#8888aa] text-lg">No tracks uploaded yet</p>
          <a href="/admin/upload" className="text-[var(--color-primary)] mt-2 inline-block hover:underline">Upload your first track</a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#8888aa] border-b border-[#2a2a4a]">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Artist</th>
                <th className="pb-3 pr-4">Genre</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Audio</th>
                <th className="pb-3 pr-4">Plays</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, idx) => (
                <tr key={track.id} className="border-b border-[#1a1a3a] hover:bg-[#1a1a3a]/50">
                  <td className="py-3 pr-4 text-[#8888aa] text-sm">{idx + 1}</td>
                  <td className="py-3 pr-4">
                    <p className="text-white font-medium">{track.title}</p>
                    {track.album && <p className="text-xs text-[#8888aa]">{track.album.title}</p>}
                  </td>
                  <td className="py-3 pr-4 text-[#ccccdd]">{track.artist?.name || '-'}</td>
                  <td className="py-3 pr-4 text-[#8888aa] text-sm capitalize">{track.genre || '-'}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${track.isPublished ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                      {track.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {getAudioUrl(track) ? (
                      <audio controls className="h-8 w-40">
                        <source src={getAudioUrl(track)!} />
                      </audio>
                    ) : (
                      <span className="text-xs text-red-400">No audio</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-[#8888aa] text-sm">{track.playCount}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePublish(track.id, track.isPublished)}
                        className={`px-3 py-1 text-xs font-medium rounded ${track.isPublished ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                      >
                        {track.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(track.id, track.title)}
                        className="px-3 py-1 text-xs font-medium rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-[#8888aa]">
        Total: {tracks.length} track{tracks.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
