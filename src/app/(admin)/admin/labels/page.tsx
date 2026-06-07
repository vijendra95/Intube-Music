'use client';

import { useState, useEffect } from 'react';

interface LabelData {
  id: string;
  name: string;
  country: string | null;
  website: string | null;
  description: string | null;
  _count?: { artists: number; albums: number };
}

export default function LabelsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [form, setForm] = useState({ name: '', description: '', website: '', country: 'India' });
  const [saving, setSaving] = useState(false);

  const loadLabels = () => {
    fetch('/api/labels').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.labels || []);
      setLabels(list);
    }).catch(() => {});
  };

  useEffect(() => { loadLabels(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', website: '', country: 'India' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (label: LabelData) => {
    setEditingId(label.id);
    setForm({
      name: label.name,
      description: label.description || '',
      website: label.website || '',
      country: label.country || 'India',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete label "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/labels/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadLabels();
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
      const url = editingId ? `/api/labels/${editingId}` : '/api/labels';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        resetForm();
        loadLabels();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save label');
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
          <h1 className="text-2xl font-bold text-white">Labels</h1>
          <p className="text-[#8888aa] text-sm mt-1">Manage record labels and companies</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Add Label
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Label' : 'Add New Label'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Label Name *</label>
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
              <label className="block text-sm font-medium text-white mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingId ? 'Update Label' : 'Save Label')}
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
        {labels.length === 0 ? (
          <div className="text-center py-16 text-[#8888aa]">
            <p className="text-5xl mb-4">🏷️</p>
            <p className="text-lg font-medium">No labels yet</p>
            <p className="text-sm mt-1">Add your first label to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#2a2a4a]">
              <tr className="text-left text-xs text-[#8888aa] uppercase">
                <th className="px-6 py-3">Label Name</th>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3">Website</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label.id} className="border-b border-[#2a2a4a] hover:bg-[#2a2a4a]/50">
                  <td className="px-6 py-4 text-white font-medium">{label.name}</td>
                  <td className="px-6 py-4 text-[#8888aa] text-sm">{label.country || '-'}</td>
                  <td className="px-6 py-4 text-[#8888aa] text-sm">{label.website || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(label)}
                      className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(label.id, label.name)}
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
