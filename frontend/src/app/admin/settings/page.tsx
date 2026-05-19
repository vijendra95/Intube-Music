"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, Save, Globe, Mail, Key, Palette } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "IntubeMedia.live",
    siteUrl: "https://intubemedia.live",
    supportEmail: "support@intubemedia.live",
    maxVideoSize: 2,
    defaultStreamSlots: 1,
    defaultStorage: 1,
    razorpayEnabled: false,
    razorpayKeyId: "",
    maintenanceMode: false,
    signupsEnabled: true,
    referralCommission: 10,
    maxFreeVideos: 3,
  });
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api("/admin/settings");
      if (data.settings) setSettings(data.settings);
    } catch {
      // use defaults
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      await api("/admin/settings", { method: "PUT", body: settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-gray-500">Configure platform-wide settings</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20"
        >
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* General */}
        <div className="card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5"><Globe className="w-4 h-4 text-purple-400" /> General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Site Name</label>
              <input value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Site URL</label>
              <input value={settings.siteUrl} onChange={(e) => setSettings({...settings, siteUrl: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Support Email</label>
              <input value={settings.supportEmail} onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5"><Settings className="w-4 h-4 text-amber-400" /> Defaults & Limits</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Max Video Size (GB)</label>
              <input type="number" min={1} value={settings.maxVideoSize} onChange={(e) => setSettings({...settings, maxVideoSize: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Default Slots</label>
                <input type="number" min={1} value={settings.defaultStreamSlots} onChange={(e) => setSettings({...settings, defaultStreamSlots: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Default Storage (GB)</label>
                <input type="number" min={1} value={settings.defaultStorage} onChange={(e) => setSettings({...settings, defaultStorage: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Referral Commission (%)</label>
              <input type="number" min={0} max={100} value={settings.referralCommission} onChange={(e) => setSettings({...settings, referralCommission: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5"><Key className="w-4 h-4 text-green-400" /> Payment (Razorpay)</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={settings.razorpayEnabled} onChange={(e) => setSettings({...settings, razorpayEnabled: e.target.checked})} className="rounded" />
              <label className="text-sm text-gray-300">Enable Razorpay Payments</label>
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Razorpay Key ID</label>
              <input value={settings.razorpayKeyId} onChange={(e) => setSettings({...settings, razorpayKeyId: e.target.value})} placeholder="rzp_live_xxxxxxxxxx" className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none font-mono" />
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5"><Palette className="w-4 h-4 text-pink-400" /> Access Control</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-xl p-4">
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-gray-500">Disable site for non-admins</p>
              </div>
              <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="rounded" />
            </div>
            <div className="flex items-center justify-between bg-[#0f0a1e] rounded-xl p-4">
              <div>
                <p className="text-sm font-medium">Allow New Signups</p>
                <p className="text-xs text-gray-500">Enable/disable registration</p>
              </div>
              <input type="checkbox" checked={settings.signupsEnabled} onChange={(e) => setSettings({...settings, signupsEnabled: e.target.checked})} className="rounded" />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Free Plan Video Limit</label>
              <input type="number" min={0} value={settings.maxFreeVideos} onChange={(e) => setSettings({...settings, maxFreeVideos: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
