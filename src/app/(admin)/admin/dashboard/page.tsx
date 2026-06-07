'use client';

import { useState, useEffect } from 'react';

interface TrackData {
  id: string;
  title: string;
  createdAt: string;
  artist?: { name: string } | null;
  genre: string | null;
  isPublished: boolean;
}

interface Stats {
  tracks: number;
  artists: number;
  albums: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ tracks: 0, artists: 0, albums: 0, users: 0 });
  const [recentTracks, setRecentTracks] = useState<TrackData[]>([]);

  useEffect(() => {
    fetch('/api/tracks?limit=5').then(r => r.json()).then(data => {
      const list = data.tracks || [];
      setRecentTracks(list);
      setStats(s => ({ ...s, tracks: data.total || list.length }));
    }).catch(() => {});
    fetch('/api/artists').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.artists || []);
      setStats(s => ({ ...s, artists: list.length }));
    }).catch(() => {});
    fetch('/api/albums').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.albums || []);
      setStats(s => ({ ...s, albums: list.length }));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tracks', value: stats.tracks, icon: '🎵' },
          { label: 'Total Artists', value: stats.artists, icon: '🎤' },
          { label: 'Total Albums', value: stats.albums, icon: '💿' },
          { label: 'Total Users', value: stats.users, icon: '👥' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-[#8888aa] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickAction href="/admin/upload" icon="⬆️" title="Upload Music" description="Upload new tracks, albums, or singles" />
        <QuickAction href="/admin/artists" icon="➕" title="Add Artist" description="Register a new artist on the platform" />
        <QuickAction href="/admin/tracks" icon="🎶" title="All Tracks" description="View and manage all uploaded tracks" />
      </div>

      {/* Recent Uploads */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Uploads</h2>
          <a href="/admin/tracks" className="text-sm text-[var(--color-primary)] hover:underline">View All</a>
        </div>
        {recentTracks.length === 0 ? (
          <div className="text-center py-12 text-[#8888aa]">
            <p className="text-4xl mb-3">📭</p>
            <p>No tracks uploaded yet. Start by uploading music!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTracks.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-3 bg-[#0f0f23] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2a2a4a] rounded-lg flex items-center justify-center text-lg">🎵</div>
                  <div>
                    <p className="text-white font-medium">{track.title}</p>
                    <p className="text-xs text-[#8888aa]">{track.artist?.name || 'Unknown'} • {track.genre || 'No genre'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${track.isPublished ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                    {track.isPublished ? 'Live' : 'Draft'}
                  </span>
                  <span className="text-xs text-[#8888aa]">{new Date(track.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  return (
    <a
      href={href}
      className="block bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 hover:border-[var(--color-primary)]/50 transition-colors group"
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="text-base font-semibold text-white mt-3 group-hover:text-[var(--color-primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#8888aa] mt-1">{description}</p>
    </a>
  );
}
