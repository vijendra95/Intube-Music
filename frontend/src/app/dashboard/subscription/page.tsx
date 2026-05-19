import { Check, X, Zap } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <p className="text-gray-400">Choose the plan that fits your streaming needs</p>
      </div>

      {/* Current Plan */}
      <div className="glass rounded-xl p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-cyan-400" />
          <div>
            <p className="font-medium">Current Plan: <span className="text-cyan-400">Free</span></p>
            <p className="text-sm text-gray-400">1 GB Storage • 720p • 2h/day • 1 Slot</p>
          </div>
        </div>
        <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">Active</span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Basic */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Basic</h3>
          <p className="text-sm text-gray-400 mb-4">Perfect for getting started</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">₹559</span>
            <span className="text-gray-400">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "1 Live Stream Slot",
              "720p HD Quality",
              "2 GB Storage",
              "YouTube only",
              "Loop Mode (24/7)",
              "Swap Videos",
              "Email Support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
            {["1080p Full HD", "Multi-Platform", "Stream Designer"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <X className="w-4 h-4 text-gray-600 shrink-0" />
                <span className="text-gray-500">{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 py-3 rounded-lg font-medium text-center transition">
            Choose Basic
          </button>
        </div>

        {/* Popular */}
        <div className="relative glass rounded-2xl p-6 flex flex-col border-cyan-500/50">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <h3 className="text-xl font-bold mb-1">Popular</h3>
          <p className="text-sm text-gray-400 mb-4">Full HD + Multi-platform</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">₹699</span>
            <span className="text-gray-400">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "1 Live Stream Slot",
              "1080p Full HD Quality",
              "5 GB Storage",
              "YouTube + Facebook",
              "Unlimited Loop (24/7)",
              "Swap Videos Unlimited",
              "Schedule Streams",
              "Stream Designer (Logo + Overlay)",
              "Auto-restart",
              "Basic Analytics",
              "WhatsApp + Email Support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium transition">
            Choose Popular
          </button>
        </div>

        {/* Custom */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-1">Custom</h3>
          <p className="text-sm text-gray-400 mb-4">Build your own plan</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">₹399</span>
            <span className="text-gray-400">/slot + add-ons</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Custom Slots (1-10)",
              "720p / 1080p Selectable",
              "Storage: 1 GB - 25 GB",
              "YouTube, Facebook, Twitch, RTMP",
              "Flexible Billing (Month/Week/Day)",
              "Auto-restart",
              "Loop Mode (24/7)",
              "Schedule Streams",
              "Priority Support",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-gray-300">{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 py-3 rounded-lg font-medium transition">
            Build Custom Plan
          </button>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-6">
        * Prices exclusive of 18% GST. Secured by Razorpay.
      </p>
    </div>
  );
}
