import Link from 'next/link';

// Demo data - will be replaced by API calls
const featuredPlaylists = [
  { id: '1', title: 'Today\'s Top Hits', description: 'The biggest songs right now', artwork: null, color: 'from-purple-700 to-blue-500' },
  { id: '2', title: 'Bollywood Butter', description: 'Smooth Bollywood vibes', artwork: null, color: 'from-orange-600 to-pink-500' },
  { id: '3', title: 'Desi Hip Hop', description: 'Best of Indian rap', artwork: null, color: 'from-green-700 to-teal-500' },
  { id: '4', title: 'Peaceful Morning', description: 'Start your day right', artwork: null, color: 'from-blue-600 to-cyan-400' },
  { id: '5', title: 'Workout Energy', description: 'Push your limits', artwork: null, color: 'from-red-600 to-orange-500' },
  { id: '6', title: 'Late Night Vibes', description: 'Wind down with chill beats', artwork: null, color: 'from-indigo-800 to-purple-600' },
];

const newReleases = [
  { id: '1', title: 'Midnight Dreams', artist: 'Arijit Singh', artwork: null, type: 'Album' },
  { id: '2', title: 'Dil Ka Safar', artist: 'Shreya Ghoshal', artwork: null, type: 'Single' },
  { id: '3', title: 'Street Life', artist: 'Divine', artwork: null, type: 'Album' },
  { id: '4', title: 'Melody Queen', artist: 'Neha Kakkar', artwork: null, type: 'EP' },
  { id: '5', title: 'Rock Nation', artist: 'Nucleya', artwork: null, type: 'Album' },
];

const trendingArtists = [
  { id: '1', name: 'Arijit Singh', avatar: null, listeners: '85M' },
  { id: '2', name: 'AP Dhillon', avatar: null, listeners: '42M' },
  { id: '3', name: 'Shreya Ghoshal', avatar: null, listeners: '55M' },
  { id: '4', name: 'Badshah', avatar: null, listeners: '38M' },
  { id: '5', name: 'Diljit Dosanjh', avatar: null, listeners: '45M' },
  { id: '6', name: 'Raftaar', avatar: null, listeners: '25M' },
];

const moodPlaylists = [
  { id: '1', name: 'Happy', emoji: '😊', color: 'bg-yellow-500' },
  { id: '2', name: 'Romantic', emoji: '❤️', color: 'bg-pink-500' },
  { id: '3', name: 'Sad', emoji: '😢', color: 'bg-blue-500' },
  { id: '4', name: 'Party', emoji: '🎉', color: 'bg-purple-500' },
  { id: '5', name: 'Chill', emoji: '😌', color: 'bg-teal-500' },
  { id: '6', name: 'Focus', emoji: '🎯', color: 'bg-green-500' },
  { id: '7', name: 'Workout', emoji: '💪', color: 'bg-red-500' },
  { id: '8', name: 'Sleep', emoji: '🌙', color: 'bg-indigo-500' },
];

export default function HomePage() {
  const greeting = getGreeting();

  return (
    <div className="p-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">{greeting}</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-surface-light)] rounded-full hover:bg-[var(--color-surface-lighter)] transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Quick Pick Mood Cards */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">How are you feeling?</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {moodPlaylists.map((mood) => (
            <Link
              key={mood.id}
              href={`/browse?mood=${mood.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-colors group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">{mood.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
          <Link href="/browse" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredPlaylists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="group p-4 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-all duration-300"
            >
              <div className={`aspect-square rounded-md mb-3 bg-gradient-to-br ${playlist.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.8">
                  <path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM21 16c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-white truncate">{playlist.title}</p>
              <p className="text-sm text-[var(--color-text-muted)] truncate mt-1">{playlist.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">New Releases</h2>
          <Link href="/browse?filter=new" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {newReleases.map((release) => (
            <Link
              key={release.id}
              href={`/album/${release.id}`}
              className="group p-4 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-all duration-300"
            >
              <div className="aspect-square rounded-md mb-3 bg-[var(--color-surface-lighter)] flex items-center justify-center relative overflow-hidden">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--color-text-muted)]">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {/* Play button overlay */}
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
              <p className="text-base font-semibold text-white truncate">{release.title}</p>
              <p className="text-sm text-[var(--color-text-muted)] truncate mt-1">
                {release.type} • {release.artist}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Artists */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Trending Artists</h2>
          <Link href="/browse?filter=artists" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="group p-4 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-all duration-300 text-center"
            >
              <div className="w-28 h-28 mx-auto rounded-full bg-[var(--color-surface-lighter)] mb-3 flex items-center justify-center overflow-hidden shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-base font-semibold text-white truncate">{artist.name}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{artist.listeners} listeners</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Charts</h2>
          <Link href="/charts" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Top 50 India', color: 'from-orange-500 to-red-600' },
            { title: 'Top 50 Global', color: 'from-blue-500 to-purple-600' },
            { title: 'Viral 50 India', color: 'from-green-500 to-teal-600' },
          ].map((chart) => (
            <Link
              key={chart.title}
              href="/charts"
              className={`p-6 rounded-lg bg-gradient-to-br ${chart.color} hover:opacity-90 transition-opacity`}
            >
              <p className="text-lg font-bold text-white">{chart.title}</p>
              <p className="text-sm text-white/70 mt-1">Updated daily</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
