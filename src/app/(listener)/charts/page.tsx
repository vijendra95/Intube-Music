'use client';

export default function ChartsPage() {
  const charts = [
    { id: '1', name: 'Top 50 India', description: 'Updated daily', icon: '🇮🇳', color: 'from-orange-600 to-green-600' },
    { id: '2', name: 'Top 50 Global', description: 'Updated daily', icon: '🌍', color: 'from-blue-600 to-purple-600' },
    { id: '3', name: 'Viral 50 India', description: 'Updated daily', icon: '🔥', color: 'from-red-600 to-orange-500' },
    { id: '4', name: 'Top Bollywood', description: 'Updated weekly', icon: '🎬', color: 'from-pink-600 to-rose-500' },
    { id: '5', name: 'Top Punjabi', description: 'Updated weekly', icon: '🎵', color: 'from-green-600 to-emerald-500' },
    { id: '6', name: 'Top Hip Hop', description: 'Updated weekly', icon: '🎤', color: 'from-yellow-600 to-orange-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Charts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts.map((chart) => (
          <div
            key={chart.id}
            className={`rounded-xl p-6 bg-gradient-to-br ${chart.color} hover:opacity-90 transition-opacity cursor-pointer`}
          >
            <span className="text-4xl mb-3 block">{chart.icon}</span>
            <h3 className="text-xl font-bold text-white">{chart.name}</h3>
            <p className="text-white/70 text-sm mt-1">{chart.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
