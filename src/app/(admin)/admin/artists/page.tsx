'use client';

import { useState, useEffect } from 'react';

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

interface ArtistData {
  id: string;
  name: string;
  genres: string | null;
  verified: boolean;
  country: string | null;
  bio: string | null;
}

export default function ArtistsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistData[]>([]);
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
  const [saving, setSaving] = useState(false);

  const loadArtists = () => {
    fetch('/api/artists').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.artists || []);
      setArtists(list);
    }).catch(() => {});
  };

  useEffect(() => { loadArtists(); }, []);

  const resetForm = () => {
    setForm({ name: '', bio: '', country: 'India', genres: [], avatar: null, coverImage: null, instagram: '', youtube: '', spotify: '', labelId: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (artist: ArtistData) => {
    setEditingId(artist.id);
    let genres: string[] = [];
    if (artist.genres) {
      try { genres = JSON.parse(artist.genres); } catch { genres = []; }
    }
    setForm({
      name: artist.name,
      bio: artist.bio || '',
      country: artist.country || 'India',
      genres,
      avatar: null,
      coverImage: null,
      instagram: '',
      youtube: '',
      spotify: '',
      labelId: '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete artist "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadArtists();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/artists/${editingId}` : '/api/artists';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          country: form.country,
          genres: form.genres,
          socialLinks: { instagram: form.instagram, youtube: form.youtube, spotify: form.spotify },
          labelId: form.labelId || null,
        }),
      });
      if (res.ok) {
        resetForm();
        loadArtists();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save artist');
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Artists</h1>
          <p className="text-[#8888aa] text-sm mt-1">Manage all artists on the platform</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Add Artist
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Artist' : 'Add New Artist'}</h2>
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
              <label className="block text-sm font-medium text-white mb-1">Genres</label>
              <input
                type="text"
                placeholder="e.g. Pop, Bollywood, Hip Hop"
                value={form.genres.join(', ')}
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
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingId ? 'Update Artist' : 'Save Artist')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-[#2a2a4a] text-white text-sm rounded-lg hover:bg-[#3a3a5a]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3">Genres</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id} className="border-b border-[#2a2a4a] hover:bg-[#2a2a4a]/50">
                  <td className="px-6 py-4 text-white font-medium">{artist.name}</td>
                  <td className="px-6 py-4 text-[#8888aa] text-sm">{artist.country || '-'}</td>
                  <td className="px-6 py-4 text-[#8888aa] text-sm">
                    {artist.genres ? (() => { try { return JSON.parse(artist.genres).join(', '); } catch { return '-'; } })() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${artist.verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {artist.verified ? 'Verified' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(artist)}
                      className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artist.id, artist.name)}
                      className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                    >
                      Delete
                    </button>
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
