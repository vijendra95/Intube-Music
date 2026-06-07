'use client';

import { useState, useEffect } from 'react';
import { upload } from '@vercel/blob/client';

interface BannerData {
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  position: number;
}

export default function BannersPage() {
  const [showForm, setShowForm] = useState(false);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    linkType: 'playlist',
    image: null as File | null,
    imagePreview: null as string | null,
  });
  const [saving, setSaving] = useState(false);

  const loadBanners = () => {
    fetch('/api/banners').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : (data.banners || []);
      setBanners(list);
    }).catch(() => {});
  };

  useEffect(() => { loadBanners(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = (ev) => setForm((prev) => ({ ...prev, imagePreview: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`Delete banner "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadBanners();
      } else {
        alert('Failed to delete banner');
      }
    } catch {
      alert('Network error');
    }
  };

  const handleToggleBanner = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        loadBanners();
      }
    } catch {
      alert('Network error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert('Please select a banner image');
      return;
    }
    setSaving(true);
    try {
      // Upload image directly to Blob storage (client-side)
      let imageUrl = '';
      try {
        const blob = await upload(form.image.name, form.image, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        imageUrl = blob.url;
      } catch {
        alert('Image upload failed');
        setSaving(false);
        return;
      }

      // Create banner
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          imageUrl,
          linkUrl: form.linkUrl,
          linkType: form.linkType,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: '', subtitle: '', linkUrl: '', linkType: 'playlist', image: null, imagePreview: null });
        loadBanners();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create banner');
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
          <h1 className="text-2xl font-bold text-white">Banners & Posters</h1>
          <p className="text-[#8888aa] text-sm mt-1">Manage homepage banners and promotional posters</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          + Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Banner headline..."
                  className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Link URL</label>
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="/playlist/xxx or /album/xxx"
                  className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Link Type</label>
                <select
                  value={form.linkType}
                  onChange={(e) => setForm({ ...form, linkType: e.target.value })}
                  className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="playlist">Playlist</option>
                  <option value="album">Album</option>
                  <option value="artist">Artist</option>
                  <option value="external">External Link</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Banner Image *</label>
              <div className="flex items-start gap-4">
                <div className="w-80 h-40 bg-[#2a2a4a] border-2 border-dashed border-[#3a3a5a] rounded-lg flex items-center justify-center overflow-hidden">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl">🖼️</span>
                      <p className="text-xs text-[#6666aa] mt-2">1600x600px recommended</p>
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="banner-upload" />
                  <label
                    htmlFor="banner-upload"
                    className="inline-block px-4 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-white cursor-pointer hover:bg-[#3a3a5a]"
                  >
                    Choose Image
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 bg-[var(--color-primary)] text-black font-semibold text-sm rounded-lg hover:bg-[var(--color-primary-hover)]">
                Save Banner
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-[#2a2a4a] text-white text-sm rounded-lg hover:bg-[#3a3a5a]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
        {banners.length === 0 ? (
          <div className="text-center py-16 text-[#8888aa]">
            <p className="text-5xl mb-4">🖼️</p>
            <p className="text-lg font-medium">No banners yet</p>
            <p className="text-sm mt-1">Add promotional banners for the homepage</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {banners.map((banner) => (
              <div key={banner.id} className="relative rounded-lg overflow-hidden border border-[#3a3a5a]">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">{banner.title}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleDeleteBanner(banner.id, banner.title)}
                    className="px-3 py-1.5 bg-red-600/90 text-white text-xs font-medium rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleBanner(banner.id, banner.isActive)}
                    className={`px-3 py-1.5 text-white text-xs font-medium rounded ${banner.isActive ? 'bg-yellow-600/90 hover:bg-yellow-700' : 'bg-green-600/90 hover:bg-green-700'}`}
                  >
                    {banner.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
