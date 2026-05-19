"use client";

import { useState, useEffect, useCallback } from "react";
import { Receipt, Search, IndianRupee } from "lucide-react";
import { api } from "@/lib/api";

interface Payment {
  _id: string;
  amount: number;
  plan: string;
  status: string;
  createdAt: string;
  orderId?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      const data = await api("/payments");
      setPayments(data.payments || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filtered = payments.filter(
    (p) =>
      p.plan?.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-gray-500">View your transaction records</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plan or order ID..."
          className="w-full bg-[#1a1333] border border-purple-900/50 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Receipt className="w-14 h-14 text-purple-900/50 mx-auto mb-3" />
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-900/30">
                <th className="text-left text-xs text-gray-500 py-3 px-5 font-medium">Date</th>
                <th className="text-left text-xs text-gray-500 py-3 px-5 font-medium">Plan</th>
                <th className="text-left text-xs text-gray-500 py-3 px-5 font-medium">Amount</th>
                <th className="text-left text-xs text-gray-500 py-3 px-5 font-medium">Status</th>
                <th className="text-left text-xs text-gray-500 py-3 px-5 font-medium">Order ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-purple-900/20 hover:bg-purple-500/5">
                  <td className="py-3 px-5 text-sm">{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="py-3 px-5 text-sm capitalize">{p.plan}</td>
                  <td className="py-3 px-5 text-sm flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />{p.amount}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                      p.status === "paid" ? "bg-green-500/10 text-green-400" :
                      p.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3 px-5 text-sm text-gray-500 font-mono text-xs">{p.orderId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
