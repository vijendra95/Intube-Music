'use client';

import { useState } from 'react';

interface ArtistForm {
  name: string;
  bio: string;
  country: string;
  genres: string[];
  avatar: File | null;
  coverImage: File | null;
  instagram: string;
  youtube: string;
  spotify: string;
  labelId: string;
}

export default function ArtistsPage() {
  const [showForm, setShowForm] = useState(false);
  const [artists] = useState<Array<{ id: string; name: string; genres: string[]; verified: boolean; tracks: number }>>([]);
  const [form, setForm] = useState<ArtistForm>({
    name: '',
    bio: '',
    country: 'India',
    genres: [],
    avatar: null,
    coverImage: null,
    instagram: '',
    youtube: '',
    spotify: '',
    labelId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to create artist
    alert('Artist created! (API not connected yet)');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Artists</h1>
          <p className="text-[#8888aa] text-sm mt-1">Manage all artists on the platform</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Add Artist
        </button>
      </div>

      {/* Add Artist Form */}
      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Artist</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Artist Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Label</label>
              <select
                value={form.labelId}
                onChange={(e) => setForm({ ...form, labelId: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">Independent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Genres</label>
              <input
                type="text"
                placeholder="e.g. Pop, Bollywood, Hip Hop"
                onChange={(e) => setForm({ ...form, genres: e.target.value.split(',').map(g => g.trim()) })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Instagram URL</label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">YouTube URL</label>
              <input
                type="url"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, avatar: e.target.files?.[0] || null })}
                className="text-xs text-[#8888aa] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#3a3a5a] file:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, coverImage: e.target.files?.[0] || null })}
                className="text-xs text-[#8888aa] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#3a3a5a] file:text-white"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)]"
              >
                Save Artist
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-[#2a2a4a] text-white text-sm rounded-lg hover:bg-[#3a3a5a]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Artists List */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
        {artists.length === 0 ? (
          <div className="text-center py-16 text-[#8888aa]">
            <p className="text-5xl mb-4">🎤</p>
            <p className="text-lg font-medium">No artists yet</p>
            <p className="text-sm mt-1">Add your first artist to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#2a2a4a]">
              <tr className="text-left text-xs text-[#8888aa] uppercase">
                <th className="px-6 py-3">Artist</th>
                <th className="px-6 py-3">Genres</th>
                <th className="px-6 py-3">Tracks</th>
                <th className="px-6 py-3">Verified</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id} className="border-b border-[#2a2a4a] hover:bg-[#2a2a4a]/50">
                  <td className="px-6 py-4 text-white font-medium">{artist.name}</td>
                  <td className="px-6 py-4 text-[#8888aa] text-sm">{artist.genres.join(', ')}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{artist.tracks}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${artist.verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {artist.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-[var(--color-primary)] hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
