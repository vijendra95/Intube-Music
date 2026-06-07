'use client';

import { useState } from 'react';

export default function LabelsPage() {
  const [showForm, setShowForm] = useState(false);
  const [labels] = useState<Array<{ id: string; name: string; artists: number; albums: number; country: string }>>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    country: 'India',
    founded: '',
    logo: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call
    alert('Label created! (API not connected yet)');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Labels / Companies</h1>
          <p className="text-[#8888aa] text-sm mt-1">Manage music labels and distribution companies</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Add Label
        </button>
      </div>

      {/* Add Label Form */}
      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Label / Company</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Label Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. T-Series, Sony Music India"
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
            <div>
              <label className="block text-sm font-medium text-white mb-1">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Founded Year</label>
              <input
                type="number"
                value={form.founded}
                onChange={(e) => setForm({ ...form, founded: e.target.value })}
                placeholder="e.g. 2020"
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="About this label..."
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, logo: e.target.files?.[0] || null })}
                className="text-xs text-[#8888aa] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#3a3a5a] file:text-white"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)]"
              >
                Save Label
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

      {/* Labels List */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
        {labels.length === 0 ? (
          <div className="text-center py-16 text-[#8888aa]">
            <p className="text-5xl mb-4">🏷️</p>
            <p className="text-lg font-medium">No labels yet</p>
            <p className="text-sm mt-1">Add music labels and companies to organize your catalog</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#2a2a4a]">
              <tr className="text-left text-xs text-[#8888aa] uppercase">
                <th className="px-6 py-3">Label</th>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3">Artists</th>
                <th className="px-6 py-3">Albums</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label.id} className="border-b border-[#2a2a4a] hover:bg-[#2a2a4a]/50">
                  <td className="px-6 py-4 text-white font-medium">{label.name}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{label.country}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{label.artists}</td>
                  <td className="px-6 py-4 text-[#8888aa]">{label.albums}</td>
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
