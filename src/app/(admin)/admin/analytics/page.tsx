export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Streams', value: '0', change: '+0%', icon: '▶️' },
          { label: 'Unique Listeners', value: '0', change: '+0%', icon: '👂' },
          { label: 'Avg. Listen Time', value: '0m', change: '+0%', icon: '⏱️' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5">
            <div className="flex justify-between items-start">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-[var(--color-primary)]">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-sm text-[#8888aa] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Streams Over Time</h3>
          <div className="h-48 flex items-center justify-center text-[#8888aa]">
            <p>Chart will appear when data is available</p>
          </div>
        </div>
        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Tracks</h3>
          <div className="h-48 flex items-center justify-center text-[#8888aa]">
            <p>No data yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
