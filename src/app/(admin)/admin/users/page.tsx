export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-[#8888aa] text-sm mt-1">Manage platform users and subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: '0', icon: '👥' },
          { label: 'Free Tier', value: '0', icon: '🆓' },
          { label: 'Premium', value: '0', icon: '⭐' },
          { label: 'Artists', value: '0', icon: '🎤' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-sm text-[#8888aa]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl overflow-hidden">
        <div className="text-center py-16 text-[#8888aa]">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-lg font-medium">No users yet</p>
          <p className="text-sm mt-1">Users will appear here after they sign up</p>
        </div>
      </div>
    </div>
  );
}
