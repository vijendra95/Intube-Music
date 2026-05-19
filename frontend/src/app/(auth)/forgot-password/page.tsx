"use client";

import Link from "next/link";
import { Radio, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Radio className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold">
              Intube<span className="text-cyan-400">Media</span>.live
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-gray-400 mt-1">Enter your email to receive a reset link</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Send Reset Link
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
