"use client";

import { useState, useEffect, useCallback } from "react";
import { Gift, Search, Plus, X, Tag } from "lucide-react";
import { api } from "@/lib/api";

interface ReferralItem {
  _id: string;
  referrer: { name: string; email: string; referralCode: string };
  referred: { name: string; email: string };
  status: string;
  totalEarnings: number;
  createdAt: string;
}

interface DiscountCode {
  _id: string;
  code: string;
  discount: number;
  type: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code: "", discount: 10, type: "percent", maxUses: 100, expiresInDays: 30 });
  const [tab, setTab] = useState("referrals");

  const fetchReferrals = useCallback(async () => {
    try {
      const data = await api("/admin/referrals");
      setReferrals(data.referrals || []);
    } catch {
      // silent
    }
  }, []);

  const fetchDiscounts = useCallback(async () => {
    try {
      const data = await api("/admin/discounts");
      setDiscounts(data.discounts || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
    fetchDiscounts();
  }, [fetchReferrals, fetchDiscounts]);

  const handleCreateDiscount = async () => {
    try {
      await api("/admin/discounts", { method: "POST", body: form });
      setShowCreate(false);
      setForm({ code: "", discount: 10, type: "percent", maxUses: 100, expiresInDays: 30 });
      fetchDiscounts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleToggleDiscount = async (id: string, isActive: boolean) => {
    try {
      await api(`/admin/discounts/${id}`, { method: "PUT", body: { isActive: !isActive } });
      fetchDiscounts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Referrals & Discounts</h1>
          <p className="text-gray-500">Manage referral program and discount codes</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Create Discount
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("referrals")} className={`px-4 py-2 rounded-full text-sm transition ${tab === "referrals" ? "gradient-bg text-white" : "bg-[#1a1333] text-gray-400 border border-purple-900/30"}`}>
          <Gift className="w-4 h-4 inline mr-1" /> Referrals ({referrals.length})
        </button>
        <button onClick={() => setTab("discounts")} className={`px-4 py-2 rounded-full text-sm transition ${tab === "discounts" ? "gradient-bg text-white" : "bg-[#1a1333] text-gray-400 border border-purple-900/30"}`}>
          <Tag className="w-4 h-4 inline mr-1" /> Discount Codes ({discounts.length})
        </button>
      </div>

      {tab === "referrals" && (
        <div className="card overflow-hidden">
          {referrals.length === 0 ? (
            <div className="p-12 text-center">
              <Gift className="w-14 h-14 text-purple-900/50 mx-auto mb-3" />
              <p className="text-gray-500">No referrals yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-900/30">
                  <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Referrer</th>
                  <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Referred</th>
                  <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Code</th>
                  <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Status</th>
                  <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Earned</th>
                  <th className="text-left text-xs text-gray-500 py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r._id} className="border-b border-purple-900/20 hover:bg-purple-500/5">
                    <td className="py-3 px-4 text-sm">{r.referrer?.name}</td>
                    <td className="py-3 px-4 text-sm">{r.referred?.name}</td>
                    <td className="py-3 px-4 text-xs font-mono text-purple-400">{r.referrer?.referralCode}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        r.status === "active" ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"
                      }`}>{r.status}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">₹{r.totalEarnings}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "discounts" && (
        <div className="space-y-3">
          {discounts.length === 0 ? (
            <div className="card p-12 text-center">
              <Tag className="w-14 h-14 text-purple-900/50 mx-auto mb-3" />
              <p className="text-gray-500">No discount codes created yet</p>
            </div>
          ) : (
            discounts.map((d) => (
              <div key={d._id} className="card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium font-mono text-amber-300">{d.code}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{d.discount}{d.type === "percent" ? "%" : "₹"} off</span>
                      <span>Used {d.usedCount}/{d.maxUses}</span>
                      {d.expiresAt && <span>Expires: {new Date(d.expiresAt).toLocaleDateString("en-IN")}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleDiscount(d._id, d.isActive)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    d.isActive ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400" : "bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400"
                  }`}
                >
                  {d.isActive ? "Active" : "Disabled"}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Discount Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1333] border border-purple-900/50 rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Create Discount Code</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Code</label>
                <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="e.g. SAVE20" className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Discount</label>
                  <input type="number" min={1} value={form.discount} onChange={(e) => setForm({...form, discount: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Type</label>
                  <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Max Uses</label>
                  <input type="number" min={1} value={form.maxUses} onChange={(e) => setForm({...form, maxUses: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Expires in (days)</label>
                  <input type="number" min={1} value={form.expiresInDays} onChange={(e) => setForm({...form, expiresInDays: Number(e.target.value)})} className="w-full bg-[#0f0a1e] border border-purple-900/50 rounded-xl py-2.5 px-4 text-white focus:border-purple-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 bg-[#0f0a1e] border border-purple-900/50 text-white py-2.5 rounded-xl font-medium transition hover:bg-[#251d40]">Cancel</button>
                <button onClick={handleCreateDiscount} className="flex-1 gradient-bg hover:opacity-90 text-white py-2.5 rounded-xl font-medium transition shadow-lg shadow-purple-500/20">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
