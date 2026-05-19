import {
  Users,
  Wifi,
  CreditCard,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-400">Manage users, streams, and platform health</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-400">Total Users</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-400">Active Streams</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹0</p>
              <p className="text-xs text-gray-400">Revenue (MTD)</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-gray-400">Uptime</p>
            </div>
          </div>
        </div>

        {/* Stream Health */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" /> Stream Health
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Average Bitrate</span>
                <span className="text-sm font-medium text-green-400">— kbps</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Average FPS</span>
                <span className="text-sm font-medium text-green-400">— fps</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Stream Errors (24h)</span>
                <span className="text-sm font-medium text-green-400">0</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Auto-Restarts (24h)</span>
                <span className="text-sm font-medium text-yellow-400">0</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> Quick Stats
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">New Users (Today)</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Active Subscriptions</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Total Videos Stored</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <span className="text-sm text-gray-300">Storage Used (All)</span>
                <span className="text-sm font-medium">0 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Streams</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No users yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="glass rounded-xl p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h2 className="font-bold text-lg">System Alerts</h2>
          </div>
          <p className="text-gray-500 text-center py-4">No alerts at this time</p>
        </div>
      </div>
    </div>
  );
}
