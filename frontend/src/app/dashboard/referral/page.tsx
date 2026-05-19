"use client";

import { useState, useEffect, useCallback } from "react";
import { Gift, Users, CreditCard, Copy, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function ReferralPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalReferrals: 0, activeSubscriptions: 0, totalEarnings: 0 });
  const [copied, setCopied] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const data = await api("/referrals/stats");
      setStats(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const referralLink = `https://intubemedia.live/register?ref=${user?.referralCode || ""}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Referral & Earn</h1>
        <p className="text-gray-500">Earn 10% commission on every referral payment</p>
      </div>

      {/* How it works */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-4">How it works</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">1</div>
            <p className="text-sm text-gray-300">Share your link</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">2</div>
            <p className="text-sm text-gray-300">Friend signs up</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">3</div>
            <p className="text-sm text-gray-300">Earn 10% forever</p>
          </div>
        </div>
      </div>

      {/* Referral Code & Link */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <label className="text-xs text-gray-500 uppercase mb-2 block">Your Referral Code</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-[#0f0a1e] border border-purple-900/30 rounded-xl py-2.5 px-4 text-purple-300 font-mono text-sm">
              {user?.referralCode || "—"}
            </code>
            <button
              onClick={() => copyText(user?.referralCode || "", "code")}
              className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 hover:bg-purple-500/20 transition"
            >
              {copied === "code" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="card p-5">
          <label className="text-xs text-gray-500 uppercase mb-2 block">Your Referral Link</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-[#0f0a1e] border border-purple-900/30 rounded-xl py-2.5 px-4 text-purple-300 font-mono text-xs truncate">
              {referralLink}
            </code>
            <button
              onClick={() => copyText(referralLink, "link")}
              className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 hover:bg-purple-500/20 transition"
            >
              {copied === "link" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-500">Total Referrals</p>
        </div>
        <div className="card p-5 text-center">
          <CreditCard className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
          <p className="text-xs text-gray-500">Active Subs</p>
        </div>
        <div className="card p-5 text-center">
          <Gift className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
          <p className="text-xs text-gray-500">Earned</p>
        </div>
      </div>
    </div>
  );
}
