'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/types';

interface ArtistData {
  id: string;
  name: string;
  avatar?: string | null;
  totalStreams: number;
}

interface TrackData {
  id: string;
  title: string;
  slug: string;
  duration: number;
  trackNumber: number;
  isExplicit: boolean;
  isPublished: boolean;
  releaseDate: string | null;
  audioUrl128: string | null;
  audioUrl320: string | null;
  audioUrlFlac: string | null;
  audioOriginal: string | null;
  videoUrl: string | null;
  canvasUrl: string | null;
  genre: string | null;
  mood: string | null;
  isrc: string | null;
  lyrics: string | null;
  playCount: number;
  likeCount: number;
  artistId: string;
  albumId: string | null;
  createdAt: string;
  artist?: { id: string; name: string; slug: string; bio: string | null; avatar: string | null; coverImage: string | null; verified: boolean; monthlyListeners: number; totalStreams: number; country: string | null; genres: string[]; socialLinks: Record<string, string> | null; label: null; labelId: string | null; } | null;
  album?: { id: string; title: string; slug: string; artwork: string | null; releaseDate: string | null; type: string; genre: string | null; description: string | null; totalTracks: number; duration: number; isExplicit: boolean; isPublished: boolean; artistId: string; labelId: string | null; } | null;
}

interface BannerData {
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
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const { setQueue, currentTrack, isPlaying } = usePlayerStore();
  const greeting = getGreeting();

  useEffect(() => {
    fetch('/api/artists?limit=6').then(r => r.json()).then(data => {
      setArtists(Array.isArray(data) ? data : (data.artists || []));
    }).catch(() => {});
    fetch('/api/tracks?limit=20&published=true').then(r => r.json()).then(data => {
      setTracks(Array.isArray(data) ? data : (data.tracks || []));
    }).catch(() => {});
    fetch('/api/banners?active=true').then(r => r.json()).then(data => {
      setBanners(Array.isArray(data) ? data : (data.banners || []));
    }).catch(() => {});
  }, []);

  const handlePlayTrack = (index: number) => {
    const playableTracks = tracks.filter(t => t.audioUrl320 || t.audioUrl128 || t.audioOriginal);
    const mappedTracks: Track[] = playableTracks.map(t => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      duration: t.duration,
      trackNumber: t.trackNumber,
      isExplicit: t.isExplicit,
      isPublished: t.isPublished,
      releaseDate: t.releaseDate,
      audioUrl128: t.audioOriginal || t.audioUrl128,
      audioUrl320: t.audioOriginal || t.audioUrl320,
      audioUrlFlac: t.audioUrlFlac,
      videoUrl: t.videoUrl,
      canvasUrl: t.canvasUrl,
      genre: t.genre,
      mood: t.mood,
      isrc: t.isrc,
      lyrics: t.lyrics,
      playCount: t.playCount,
      likeCount: t.likeCount,
      artist: t.artist as Track['artist'],
      artistId: t.artistId,
      album: t.album as Track['album'],
      albumId: t.albumId,
      createdAt: t.createdAt,
    }));

    // Find the real index in playable tracks
    const clickedTrack = tracks[index];
    const playableIndex = playableTracks.findIndex(t => t.id === clickedTrack.id);
    if (playableIndex >= 0) {
      setQueue(mappedTracks, playableIndex);
    }
  };

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

      {/* Banners */}
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

      {/* Tracks - Playable List */}
      {tracks.length > 0 && (
        <section className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">New Releases</h2>
            <Link href="/browse?filter=new" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
              Show all
            </Link>
          </div>
          <div className="space-y-1">
            {tracks.slice(0, 15).map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const hasAudio = !!(track.audioUrl320 || track.audioUrl128 || track.audioOriginal);
              return (
                <div
                  key={track.id}
                  onClick={() => hasAudio && handlePlayTrack(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isCurrentTrack ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30' : 'hover:bg-[var(--color-surface-light)]'
                  } ${!hasAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Track number / play icon */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {isCurrentTrack && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '60%'}}></span>
                        <span className="w-1 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '100%', animationDelay: '0.2s'}}></span>
                        <span className="w-1 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '40%', animationDelay: '0.4s'}}></span>
                      </div>
                    ) : (
                      <span className="text-sm text-[#8888aa] group-hover:hidden">{index + 1}</span>
                    )}
                    {!(isCurrentTrack && isPlaying) && (
                      <svg className="w-4 h-4 text-white hidden group-hover:block" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </div>

                  {/* Album art */}
                  <div className="w-10 h-10 rounded bg-[var(--color-surface-lighter)] flex-shrink-0 overflow-hidden">
                    {track.album?.artwork ? (
                      <img src={track.album.artwork} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#666]">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title & Artist */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-[var(--color-primary)]' : 'text-white'}`}>{track.title}</p>
                    <p className="text-xs text-[#8888aa] truncate">{track.artist?.name || 'Unknown Artist'}</p>
                  </div>

                  {/* Genre/Mood badge */}
                  {(track.mood || track.genre) && (
                    <span className="hidden md:inline-block px-2 py-0.5 text-[10px] rounded-full bg-[var(--color-surface-lighter)] text-[#aaa] capitalize">
                      {track.mood || track.genre}
                    </span>
                  )}

                  {/* Duration placeholder */}
                  <span className="text-xs text-[#8888aa] w-10 text-right">
                    {track.duration > 0 ? formatTime(track.duration) : '--:--'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Artists */}
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

      {/* Charts */}
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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
