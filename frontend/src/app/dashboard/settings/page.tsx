"use client";

import { useState } from "react";
import { User, Building, Lock, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api("/users/profile", { method: "PUT", body: { name, phone } });
      await refreshUser();
      setSuccess("Profile updated!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setLoading(false); }
  };

  const handleBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await api("/users/billing", { method: "PUT", body: { company, gst, address } });
      await refreshUser();
      setSuccess("Billing details saved!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setLoading(false); }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return; }
    if (newPassword.length < 8) { setError("Min 8 characters"); return; }
    setLoading(true);
    try {
      await api("/users/password", { method: "PUT", body: { currentPassword, newPassword } });
      setSuccess("Password changed!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "billing", label: "Billing", icon: Building },
    { id: "password", label: "Password", icon: Lock },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setError(""); setSuccess(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              tab === t.id
                ? "gradient-bg text-white shadow-lg shadow-purple-500/20"
                : "bg-[#1a1333] text-gray-400 hover:text-white border border-purple-900/30"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <Check className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
          {error}
        </div>
      )}

      <div className="card p-7 max-w-xl">
        {tab === "profile" && (
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email</label>
              <input type="email" value={user?.email || ""} disabled className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
              />
            </div>
            <button type="submit" disabled={loading} className="gradient-bg hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20 disabled:opacity-50">
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}

        {tab === "billing" && (
          <form onSubmit={handleBilling} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Company Name</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">GST Number</label>
              <input type="text" value={gst} onChange={(e) => setGst(e.target.value)} placeholder="GST number" className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Billing Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" rows={3} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition resize-none" />
            </div>
            <button type="submit" disabled={loading} className="gradient-bg hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20 disabled:opacity-50">
              {loading ? "Saving..." : "Save Billing"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min 8 characters" className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none transition" />
            </div>
            <button type="submit" disabled={loading} className="gradient-bg hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20 disabled:opacity-50">
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
