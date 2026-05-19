"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditCard, Search, Edit2, X } from "lucide-react";
import { api } from "@/lib/api";

interface SubUser {
  _id: string;
  name: string;
  email: string;
  plan: string;
  planExpiry: string | null;
  streamSlots: number;
  storage: { used: number; limit: number };
}

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState<SubUser[]>([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<SubUser | null>(null);
  const [form, setForm] = useState({ plan: "free", streamSlots: 1, storageGB: 1, daysToAdd: 30 });

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api(`/admin/users?search=${search}`);
      setUsers(data.users);
    } catch {
      // silent
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (u: SubUser) => {
    setEditUser(u);
    setForm({
      plan: u.plan,
      streamSlots: u.streamSlots,
      storageGB: Math.round(u.storage.limit / (1024 * 1024 * 1024)),
      daysToAdd: 30,
    });
  };

  const handleSave = async () => {
    if (!editUser) return;
    try {
      await api(`/admin/users/${editUser._id}/subscription`, {
        method: "PUT",
        body: {
          plan: form.plan,
          streamSlots: form.streamSlots,
          storageLimit: form.storageGB * 1024 * 1024 * 1024,
          daysToAdd: form.daysToAdd,
        },
      });
      setEditUser(null);
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-gray-500">Manage user plans and limits</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
          className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-900/30">
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">User</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Plan</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Expiry</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Slots</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Storage</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-purple-900/20 hover:bg-purple-500/5">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                    u.plan === "popular" ? "bg-purple-500/10 text-purple-400" :
                    u.plan === "basic" ? "bg-blue-500/10 text-blue-400" :
                    u.plan === "custom" ? "bg-amber-500/10 text-amber-400" :
                    "bg-gray-500/10 text-gray-400"
                  }`}>{u.plan}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  {u.planExpiry ? new Date(u.planExpiry).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="py-3 px-4 text-sm">{u.streamSlots}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{(u.storage.limit / (1024*1024*1024)).toFixed(0)}GB</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEdit(u)} className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1333] border border-purple-900/50 rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Manage Subscription</h2>
                <p className="text-xs text-gray-500">{editUser.name} ({editUser.email})</p>
              </div>
              <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Plan</label>
                <select value={form.plan} onChange={(e) => setForm({...form, plan: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none">
                  <option value="free">Free</option>
                  <option value="basic">Basic (₹559/mo)</option>
                  <option value="popular">Popular (₹699/mo)</option>
                  <option value="custom">Custom (₹399+)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Stream Slots</label>
                  <input type="number" min={1} value={form.streamSlots} onChange={(e) => setForm({...form, streamSlots: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Storage (GB)</label>
                  <input type="number" min={1} value={form.storageGB} onChange={(e) => setForm({...form, storageGB: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Extend Expiry (days)</label>
                <input type="number" min={0} value={form.daysToAdd} onChange={(e) => setForm({...form, daysToAdd: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)} className="flex-1 bg-[#0f0a1e] border border-purple-900/50 text-white py-2.5 rounded-xl font-medium transition hover:bg-[#251d40]">Cancel</button>
                <button onClick={handleSave} className="flex-1 gradient-bg hover:opacity-90 text-white py-2.5 rounded-xl font-medium transition shadow-lg shadow-purple-500/20">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
