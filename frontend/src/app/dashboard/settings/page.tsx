"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, Building, FileText, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "password">("profile");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg mb-6 w-fit">
        {(["profile", "billing", "password"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Profile Information</h2>
          <form className="space-y-5 max-w-lg">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Billing Details</h2>
          <form className="space-y-5 max-w-lg">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Company Name (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Company name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">GST Number (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="29GGGGG1314R9Z6"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Billing Address</label>
              <textarea
                placeholder="Enter billing address"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Save Billing Details
            </button>
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6">Change Password</h2>
          <form className="space-y-5 max-w-lg">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
