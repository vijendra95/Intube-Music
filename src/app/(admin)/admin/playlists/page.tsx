'use client';

import { useState } from 'react';

export default function PlaylistsPage() {
  const [showForm, setShowForm] = useState(false);
  const [playlists] = useState<Array<{ id: string; title: string; tracks: number; isEditorial: boolean }>>([]);
  const [form, setForm] = useState({ title: '', description: '', mood: '', genre: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Playlist created! (API not connected yet)');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Playlists</h1>
          <p className="text-[#8888aa] text-sm mt-1">Create and manage editorial playlists</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Create Playlist
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create Editorial Playlist</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Playlist Name *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Bollywood Hits 2024"
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Mood</label>
              <input
                type="text"
                value={form.mood}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
                placeholder="e.g. Happy, Chill, Energetic"
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-5 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-[#2a2a4a] text-white text-sm rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
        {playlists.length === 0 ? (
          <div className="text-center py-16 text-[#8888aa]">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg font-medium">No playlists yet</p>
            <p className="text-sm mt-1">Create editorial playlists for your users</p>
          </div>
        ) : (
          <div className="divide-y divide-[#2a2a4a]">
            {playlists.map((pl) => (
              <div key={pl.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#2a2a4a]/50">
                <div>
                  <p className="text-white font-medium">{pl.title}</p>
                  <p className="text-sm text-[#8888aa]">{pl.tracks} tracks</p>
                </div>
                <button className="text-sm text-[var(--color-primary)] hover:underline">Edit</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
