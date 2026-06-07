'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Artist {
  id: string;
  name: string;
  avatar?: string | null;
  totalStreams: number;
}

interface Track {
  id: string;
  title: string;
  artist?: { name: string } | null;
  album?: { artwork?: string | null } | null;
  genre?: string | null;
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
}

const moodPlaylists = [
  { id: '1', name: 'Happy', emoji: '\u{1F60A}', color: 'bg-yellow-500' },
  { id: '2', name: 'Romantic', emoji: '\u{2764}\u{FE0F}', color: 'bg-pink-500' },
  { id: '3', name: 'Sad', emoji: '\u{1F622}', color: 'bg-blue-500' },
  { id: '4', name: 'Party', emoji: '\u{1F389}', color: 'bg-purple-500' },
  { id: '5', name: 'Chill', emoji: '\u{1F60C}', color: 'bg-teal-500' },
  { id: '6', name: 'Focus', emoji: '\u{1F3AF}', color: 'bg-green-500' },
  { id: '7', name: 'Workout', emoji: '\u{1F4AA}', color: 'bg-red-500' },
  { id: '8', name: 'Sleep', emoji: '\u{1F319}', color: 'bg-indigo-500' },
];

export default function HomePage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const greeting = getGreeting();

  useEffect(() => {
    fetch('/api/artists?limit=6').then(r => r.json()).then(data => {
      setArtists(Array.isArray(data) ? data : (data.artists || []));
    }).catch(() => {});
    fetch('/api/tracks?limit=10&published=true').then(r => r.json()).then(data => {
      setTracks(Array.isArray(data) ? data : (data.tracks || []));
    }).catch(() => {});
    fetch('/api/banners?active=true').then(r => r.json()).then(data => {
      setBanners(Array.isArray(data) ? data : (data.banners || []));
    }).catch(() => {});
  }, []);

  return (
    <div className="p-4 md:p-6 pb-32 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting}</h1>
          <p className="text-xs text-[#b3b3b3] mt-0.5">Intube Music by Intube Media</p>
        </div>
        <Link href="/login" className="w-9 h-9 rounded-full bg-[var(--color-surface-light)] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">{greeting}</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-surface-light)] rounded-full hover:bg-[var(--color-surface-lighter)] transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Banners from Admin */}
      {banners.length > 0 && (
        <section className="mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {banners.map((banner) => (
              <div key={banner.id} className="relative rounded-xl overflow-hidden h-40 md:h-48">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <p className="text-lg font-bold text-white">{banner.title}</p>
                    {banner.subtitle && <p className="text-sm text-white/70">{banner.subtitle}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mood Cards */}
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">How are you feeling?</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
          {moodPlaylists.map((mood) => (
            <Link
              key={mood.id}
              href={`/browse?mood=${mood.name.toLowerCase()}`}
              className="flex flex-col items-center gap-1.5 md:gap-2 p-2.5 md:p-3 rounded-xl bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-colors group active:scale-95"
            >
              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
              <span className="text-[11px] md:text-sm font-medium text-[var(--color-text-secondary)]">{mood.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Releases / Tracks from Database */}
      {tracks.length > 0 && (
        <section className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">New Releases</h2>
            <Link href="/browse?filter=new" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {tracks.slice(0, 10).map((track) => (
              <div
                key={track.id}
                className="group p-3 md:p-4 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-all duration-300 active:scale-95"
              >
                <div className="aspect-square rounded-md mb-2 md:mb-3 bg-[var(--color-surface-lighter)] flex items-center justify-center relative overflow-hidden">
                  {track.album?.artwork ? (
                    <img src={track.album.artwork} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--color-text-muted)] md:w-12 md:h-12">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  <div className="absolute bottom-2 right-2 w-9 h-9 md:w-10 md:h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm md:text-base font-semibold text-white truncate">{track.title}</p>
                <p className="text-xs md:text-sm text-[var(--color-text-muted)] truncate mt-0.5 md:mt-1">
                  {track.genre || 'Song'} &bull; {track.artist?.name || 'Unknown'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Artists from Database */}
      {artists.length > 0 && (
        <section className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">Artists</h2>
            <Link href="/browse?filter=artists" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
              Show all
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {artists.slice(0, 6).map((artist) => (
              <div
                key={artist.id}
                className="group p-3 md:p-4 rounded-lg bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-all duration-300 text-center active:scale-95"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto rounded-full bg-[var(--color-surface-lighter)] mb-2 md:mb-3 flex items-center justify-center overflow-hidden shadow-lg">
                  {artist.avatar ? (
                    <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)] md:w-10 md:h-10">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <p className="text-sm md:text-base font-semibold text-white truncate">{artist.name}</p>
                <p className="text-[11px] md:text-sm text-[var(--color-text-muted)] mt-0.5 md:mt-1">{Number(artist.totalStreams).toLocaleString()} streams</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Charts Section */}
      <section className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">Charts</h2>
          <Link href="/charts" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
            Show all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { title: 'Top 50 India', color: 'from-orange-500 to-red-600' },
            { title: 'Top 50 Global', color: 'from-blue-500 to-purple-600' },
            { title: 'Viral 50 India', color: 'from-green-500 to-teal-600' },
          ].map((chart) => (
            <Link
              key={chart.title}
              href="/charts"
              className={`p-5 md:p-6 rounded-lg bg-gradient-to-br ${chart.color} hover:opacity-90 transition-opacity active:scale-[0.98]`}
            >
              <p className="text-lg font-bold text-white">{chart.title}</p>
              <p className="text-sm text-white/70 mt-1">Updated daily</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/5 mt-4">
        <p className="text-sm text-[#666]">Intube Music</p>
        <p className="text-xs text-[#444] mt-1">A product of Intube Media</p>
      </footer>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}
