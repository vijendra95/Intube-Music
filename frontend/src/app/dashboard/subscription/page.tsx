"use client";

import { Check, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useState } from "react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 559,
    features: [
      "5GB Storage",
      "720p Quality",
      "1 Stream Slot",
      "YouTube Only",
      "Loop 24/7",
      "Email Support",
    ],
  },
  {
    id: "popular",
    name: "Popular",
    price: 699,
    popular: true,
    features: [
      "15GB Storage",
      "1080p Quality",
      "3 Stream Slots",
      "Multi-Platform",
      "Loop 24/7",
      "Auto-Restart",
      "Priority Support",
      "Stream Designer",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    price: 399,
    features: [
      "Custom Storage",
      "1080p Quality",
      "Unlimited Slots",
      "Multi-Platform",
      "All Features",
      "Dedicated Support",
      "Custom RTMP",
      "API Access",
    ],
  },
];

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState("");

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const data = await api("/subscriptions/create", {
        method: "POST",
        body: { plan: planId },
      });

      if (data.orderId && typeof window !== "undefined" && (window as unknown as { Razorpay: unknown }).Razorpay) {
        const options = {
          key: data.razorpayKey,
          amount: data.amount,
          currency: "INR",
          name: "IntubeMedia.live",
          description: `${planId} Plan Subscription`,
          order_id: data.orderId,
          handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
            await api("/subscriptions/verify", {
              method: "POST",
              body: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            await refreshUser();
            alert("Subscription activated!");
          },
        };
        const rzp = new ((window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay)(options);
        rzp.open();
      } else {
        await refreshUser();
        alert("Subscription request sent! Payment integration pending.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setLoading("");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <p className="text-gray-500">Choose the plan that fits your streaming needs</p>
      </div>

      {/* Current Plan */}
      <div className="card p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Current Plan</p>
          <p className="text-lg font-bold capitalize">{user?.plan || "Free"}</p>
        </div>
        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 font-medium">
          Active
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative card p-7 flex flex-col ${
              plan.popular ? "border-purple-500/40 glow-purple" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-bold">₹{plan.price}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-7 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Check className={`w-4 h-4 shrink-0 ${plan.popular ? "text-amber-400" : "text-purple-400"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading === plan.id || user?.plan === plan.id}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                plan.popular
                  ? "gradient-bg text-white shadow-lg shadow-purple-500/20 hover:opacity-90"
                  : "bg-[#0f0a1e] border border-purple-500/30 text-white hover:border-purple-500/60"
              } disabled:opacity-50`}
            >
              {user?.plan === plan.id ? "Current Plan" : loading === plan.id ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
