"use client";

import { Gift, Copy, Users, IndianRupee, CheckCircle, Share2 } from "lucide-react";

export default function ReferralPage() {
  const referralCode = "INTUBE-USER123";
  const referralLink = `https://intubemedia.live/register?ref=${referralCode}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Referral & Earn</h1>
        <p className="text-gray-400">Earn 10% commission on every payment made by your referrals</p>
      </div>

      {/* Referral Info */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <Share2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="font-medium mb-1">1. Share Your Link</h3>
            <p className="text-sm text-gray-400">Share your referral code or link with friends</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-medium mb-1">2. Friend Signs Up</h3>
            <p className="text-sm text-gray-400">They register using your referral code</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <IndianRupee className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-medium mb-1">3. You Earn 10%</h3>
            <p className="text-sm text-gray-400">Get 10% of every payment they make</p>
          </div>
        </div>
      </div>

      {/* Referral Code & Link */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Your Referral Details</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Referral Code</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white font-mono"
              />
              <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 rounded-lg transition">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Referral Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white font-mono text-sm"
              />
              <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-3 rounded-lg transition">
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-400">Total Referrals</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-400">Active Subscriptions</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <IndianRupee className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">₹0</p>
          <p className="text-sm text-gray-400">Total Earnings</p>
        </div>
      </div>

      {/* Referral History */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Referral History</h2>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No referrals yet</p>
          <p className="text-gray-500 text-sm mt-1">Share your link to start earning</p>
        </div>
      </div>
    </div>
  );
}
