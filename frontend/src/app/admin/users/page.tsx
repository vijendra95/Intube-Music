"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Search, Ban, Check, Edit2, Trash2, X, Crown } from "lucide-react";
import { api } from "@/lib/api";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  plan: string;
  role: string;
  isActive: boolean;
  storage: { used: number; limit: number };
  streamSlots: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", plan: "", role: "", streamSlots: 1, storageLimit: 1, isActive: true });

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

  const handleEdit = (user: UserItem) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      streamSlots: user.streamSlots,
      storageLimit: Math.round(user.storage.limit / (1024 * 1024 * 1024)),
      isActive: user.isActive,
    });
  };

  const handleSave = async () => {
    if (!editUser) return;
    try {
      await api(`/admin/users/${editUser._id}`, {
        method: "PUT",
        body: {
          name: editForm.name,
          plan: editForm.plan,
          role: editForm.role,
          streamSlots: editForm.streamSlots,
          storageLimit: editForm.storageLimit * 1024 * 1024 * 1024,
          isActive: editForm.isActive,
        },
      });
      setEditUser(null);
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will permanently delete this user and all their data.")) return;
    try {
      await api(`/admin/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleToggleBan = async (user: UserItem) => {
    try {
      await api(`/admin/users/${user._id}`, {
        method: "PUT",
        body: { isActive: !user.isActive },
      });
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleMakeAdmin = async (id: string) => {
    if (!confirm("Make this user an Admin?")) return;
    try {
      await api(`/admin/users/${id}`, { method: "PUT", body: { role: "admin" } });
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-gray-500">{users.length} total users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
        />
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-900/30">
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">User</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Plan</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Slots</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Storage</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Status</th>
              <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-purple-900/20 hover:bg-purple-500/5">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        {u.name}
                        {u.role === "admin" && <Crown className="w-3 h-3 text-amber-400" />}
                      </p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                    u.plan === "popular" ? "bg-purple-500/10 text-purple-400" :
                    u.plan === "basic" ? "bg-blue-500/10 text-blue-400" :
                    u.plan === "custom" ? "bg-amber-500/10 text-amber-400" :
                    "bg-gray-500/10 text-gray-400"
                  }`}>{u.plan}</span>
                </td>
                <td className="py-3 px-4 text-sm">{u.streamSlots}</td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  {(u.storage.used / (1024*1024)).toFixed(0)}MB / {(u.storage.limit / (1024*1024*1024)).toFixed(0)}GB
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    u.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  }`}>{u.isActive ? "Active" : "Banned"}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(u)} className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleToggleBan(u)} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition" title={u.isActive ? "Ban" : "Unban"}>
                      {u.isActive ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    {u.role !== "admin" && (
                      <button onClick={() => handleMakeAdmin(u._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition" title="Make Admin">
                        <Crown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
              <h2 className="text-lg font-bold">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Plan</label>
                  <select value={editForm.plan} onChange={(e) => setEditForm({...editForm, plan: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none">
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="popular">Popular</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Role</label>
                  <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Stream Slots</label>
                  <input type="number" min={1} value={editForm.streamSlots} onChange={(e) => setEditForm({...editForm, streamSlots: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Storage (GB)</label>
                  <input type="number" min={1} value={editForm.storageLimit} onChange={(e) => setEditForm({...editForm, storageLimit: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} className="rounded" />
                <label className="text-sm text-gray-300">Account Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)} className="flex-1 bg-[#0f0a1e] hover:bg-[#251d40] border border-purple-900/50 text-white py-2.5 rounded-xl font-medium transition">Cancel</button>
                <button onClick={handleSave} className="flex-1 gradient-bg hover:opacity-90 text-white py-2.5 rounded-xl font-medium transition shadow-lg shadow-purple-500/20">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
