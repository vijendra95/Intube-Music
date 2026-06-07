'use client';

import { useState, useEffect } from 'react';

const defaultSettings = {
  siteName: 'Intube Music',
  tagline: 'Your Music, Your Way',
  primaryColor: '#1ed760',
  supportEmail: 'support@intubemusic.com',
  maxUploadSize: '100',
  allowRegistration: true,
  requireEmailVerification: false,
  freeStreamQuality: '128',
  premiumStreamQuality: '320',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('intube_settings');
    if (saved) {
      try { setSettings({ ...defaultSettings, ...JSON.parse(saved) }); } catch {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('intube_settings', JSON.stringify(settings));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 500);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Platform Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Brand Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-10 h-9 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streaming */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Streaming Quality</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Free Tier Quality (kbps)</label>
              <select
                value={settings.freeStreamQuality}
                onChange={(e) => setSettings({ ...settings, freeStreamQuality: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="96">96 kbps</option>
                <option value="128">128 kbps</option>
                <option value="160">160 kbps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Premium Quality (kbps)</label>
              <select
                value={settings.premiumStreamQuality}
                onChange={(e) => setSettings({ ...settings, premiumStreamQuality: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="256">256 kbps</option>
                <option value="320">320 kbps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: e.target.value })}
                className="w-full px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Auth */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Authentication</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-white">Allow new user registration</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-white">Require email verification</span>
            </label>
          </div>
        </div>

        {saveStatus === 'saved' && (
          <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium">
            Settings saved successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className="px-6 py-3 bg-[var(--color-primary)] text-black font-semibold rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
