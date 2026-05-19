import { Receipt, Search } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-gray-400">View all your past transactions</p>
      </div>

      {/* Search / Filter */}
      <div className="glass rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition"
          />
        </div>
        <select className="bg-gray-800 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:border-cyan-500 focus:outline-none transition">
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions found</p>
                  <p className="text-gray-500 text-sm mt-1">Your payment history will appear here</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
