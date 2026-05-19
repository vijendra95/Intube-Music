"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tv, Mail, Lock, Eye, EyeOff, User, Phone, Tag } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, password, referralCode: referralCode || undefined });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4 hero-gradient relative">
      <div className="absolute top-20 left-1/4 w-60 h-60 bg-purple-600/15 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              intube<span className="text-purple-400">media</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-gray-400 mt-1">Start streaming in minutes</p>
        </div>

        <div className="card p-7">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Referral Code (optional)</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-12 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-2 cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg hover:opacity-90 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-purple-500/25 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
