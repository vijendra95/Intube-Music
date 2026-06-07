export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tracks', value: '0', icon: '🎵', change: '+0 this week' },
          { label: 'Total Artists', value: '0', icon: '🎤', change: '+0 this week' },
          { label: 'Total Albums', value: '0', icon: '💿', change: '+0 this week' },
          { label: 'Total Users', value: '0', icon: '👥', change: '+0 this week' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-[var(--color-primary)]">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-[#8888aa] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickAction
          href="/admin/upload"
          icon="⬆️"
          title="Upload Music"
          description="Upload new tracks, albums, or singles"
        />
        <QuickAction
          href="/admin/artists"
          icon="➕"
          title="Add Artist"
          description="Register a new artist on the platform"
        />
        <QuickAction
          href="/admin/labels"
          icon="🏷️"
          title="Add Label"
          description="Add a new music label/company"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-[#8888aa]">
          <p className="text-4xl mb-3">📭</p>
          <p>No activity yet. Start by uploading music!</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  return (
    <a
      href={href}
      className="block bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-5 hover:border-[var(--color-primary)]/50 transition-colors group"
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="text-base font-semibold text-white mt-3 group-hover:text-[var(--color-primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#8888aa] mt-1">{description}</p>
    </a>
  );
}
