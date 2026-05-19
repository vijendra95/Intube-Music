import { Check, Zap } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-gray-500">Choose the plan that fits your needs</p>
      </div>

      {/* Current Plan */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium">Current: <span className="text-purple-400">Free Plan</span></p>
            <p className="text-xs text-gray-500">1 GB • 720p • 2h/day • 1 Slot</p>
          </div>
        </div>
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-medium">Active</span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Basic */}
        <div className="card p-7 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Basic</h3>
          <p className="text-sm text-gray-500 mb-5">Get started</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">₹559</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {["1 Stream Slot", "720p HD", "2 GB Storage", "YouTube Only", "24/7 Loop", "Email Support"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 py-3 rounded-full font-medium transition">
            Choose Basic
          </button>
        </div>

        {/* Popular */}
        <div className="relative card p-7 flex flex-col border-purple-500/40 glow-purple">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-bg text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            BEST VALUE
          </div>
          <h3 className="text-xl font-bold mb-1">Popular</h3>
          <p className="text-sm text-gray-500 mb-5">Most chosen</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">₹699</span>
            <span className="text-gray-500">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {["1 Stream Slot", "1080p Full HD", "5 GB Storage", "YouTube + Facebook", "Unlimited Loop", "Stream Designer", "Auto-restart", "Analytics", "WhatsApp Support"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full gradient-bg hover:opacity-90 text-white py-3 rounded-full font-semibold transition shadow-lg shadow-purple-500/25">
            Choose Popular
          </button>
        </div>

        {/* Custom */}
        <div className="card p-7 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Custom</h3>
          <p className="text-sm text-gray-500 mb-5">Build your own</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">₹399</span>
            <span className="text-gray-500">/slot</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {["1-10 Slots", "720p / 1080p", "1-25 GB Storage", "All Platforms", "Flexible Billing", "Auto-restart", "Priority Support"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 py-3 rounded-full font-medium transition">
            Build Plan
          </button>
        </div>
      </div>

      <p className="text-center text-gray-600 text-xs mt-6">All prices exclusive of 18% GST • Razorpay secured</p>
    </div>
  );
}
