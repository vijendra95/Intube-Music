'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/types';

interface ArtistData {
  id: string;
  name: string;
  slug: string;
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
  coverUrl: string | null;
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

const moodList = [
  { name: 'Happy', emoji: '\u{1F60A}', color: 'from-yellow-500 to-orange-500' },
  { name: 'Romantic', emoji: '\u{2764}\u{FE0F}', color: 'from-pink-500 to-rose-500' },
  { name: 'Sad', emoji: '\u{1F622}', color: 'from-blue-500 to-cyan-600' },
  { name: 'Party', emoji: '\u{1F389}', color: 'from-purple-500 to-violet-600' },
  { name: 'Chill', emoji: '\u{1F60C}', color: 'from-teal-500 to-emerald-500' },
  { name: 'Focus', emoji: '\u{1F3AF}', color: 'from-green-500 to-lime-500' },
  { name: 'Workout', emoji: '\u{1F4AA}', color: 'from-red-500 to-rose-600' },
  { name: 'Sleep', emoji: '\u{1F319}', color: 'from-indigo-500 to-blue-600' },
  { name: 'Devotional', emoji: '\u{1F64F}', color: 'from-amber-500 to-yellow-600' },
  { name: 'Motivational', emoji: '\u{1F525}', color: 'from-orange-500 to-red-500' },
];

export default function HomePage() {
  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodTracks, setMoodTracks] = useState<TrackData[]>([]);
  const { setQueue, currentTrack, isPlaying } = usePlayerStore();
  const greeting = getGreeting();

  useEffect(() => {
    fetch('/api/artists?limit=10').then(r => r.json()).then(data => {
      setArtists(Array.isArray(data) ? data : (data.artists || []));
    }).catch(() => {});
    fetch('/api/tracks?limit=50&published=true').then(r => r.json()).then(data => {
      setTracks(Array.isArray(data) ? data : (data.tracks || []));
    }).catch(() => {});
    fetch('/api/banners?active=true').then(r => r.json()).then(data => {
      setBanners(Array.isArray(data) ? data : (data.banners || []));
    }).catch(() => {});
  }, []);

  const handleMoodSelect = (moodName: string) => {
    if (selectedMood === moodName) {
      setSelectedMood(null);
      setMoodTracks([]);
      return;
    }
    setSelectedMood(moodName);
    fetch(`/api/tracks?mood=${moodName.toLowerCase()}&limit=50&published=true`).then(r => r.json()).then(data => {
      setMoodTracks(Array.isArray(data) ? data : (data.tracks || []));
    }).catch(() => setMoodTracks([]));
  };

  const mapToPlayerTrack = (t: TrackData): Track => ({
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
    coverUrl: t.coverUrl || null,
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
  });

  const handlePlayTrack = (trackList: TrackData[], index: number) => {
    const playable = trackList.filter(t => t.audioUrl320 || t.audioUrl128 || t.audioOriginal);
    const mapped = playable.map(mapToPlayerTrack);
    const clicked = trackList[index];
    const realIdx = playable.findIndex(t => t.id === clicked.id);
    if (realIdx >= 0) setQueue(mapped, realIdx);
  };

  const displayTracks = selectedMood ? moodTracks : tracks;

  return (
    <div className="p-4 md:p-6 pb-32 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Image src="/intube-media-logo.jpeg" alt="Intube Media" width={36} height={36} className="rounded-lg" />
          <div>
            <h1 className="text-xl font-bold text-white">{greeting}</h1>
            <p className="text-[10px] text-[#b3b3b3]">Intube Music by Intube Media</p>
          </div>
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
        <div className="flex items-center gap-3">
          <Image src="/intube-media-logo.jpeg" alt="Intube Media" width={44} height={44} className="rounded-lg" />
          <h1 className="text-4xl font-bold text-white">{greeting}</h1>
        </div>
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

      {/* Tracks Section */}
      <div className="mb-6 md:mb-8">
          {displayTracks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {selectedMood ? `${selectedMood} Songs` : 'New Releases'}
                </h2>
                <Link href={selectedMood ? `/browse?mood=${selectedMood.toLowerCase()}` : '/browse?filter=new'} className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white">
                  Show all
                </Link>
              </div>

              {/* Featured / Highlighted Track Cards (first 4) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {displayTracks.slice(0, 4).map((track, index) => {
                  const isCurrentTrack = currentTrack?.id === track.id;
                  const hasAudio = !!(track.audioUrl320 || track.audioUrl128 || track.audioOriginal);
                  return (
                    <div
                      key={track.id}
                      onClick={() => hasAudio && handlePlayTrack(displayTracks, index)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        isCurrentTrack ? 'ring-2 ring-[var(--color-primary)]' : ''
                      } ${!hasAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="aspect-square bg-[var(--color-surface-light)] relative">
                        {(track.coverUrl || track.album?.artwork) ? (
                          <img src={(track.coverUrl || track.album?.artwork)!} alt={track.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4a]">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#444]">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" />
                              <path d="M12 2a10 10 0 0 1 0 20" />
                            </svg>
                          </div>
                        )}
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {isCurrentTrack && isPlaying ? (
                            <div className="flex items-end gap-1 h-8">
                              <span className="w-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '60%'}}></span>
                              <span className="w-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '100%', animationDelay: '0.2s'}}></span>
                              <span className="w-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '40%', animationDelay: '0.4s'}}></span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-xl">
                              <svg className="w-5 h-5 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--color-surface-light)]">
                        <p className={`text-base font-semibold truncate ${isCurrentTrack ? 'text-[var(--color-primary)]' : 'text-white'}`}>{track.title}</p>
                        <Link
                          href={`/artist/${track.artist?.slug || track.artistId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-[#aaa] truncate block hover:text-white hover:underline"
                        >
                          {track.artist?.name || 'Unknown Artist'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Track List (remaining tracks) */}
              <div className="space-y-1">
                {displayTracks.slice(4, 30).map((track, index) => {
                  const realIndex = index + 4;
                  const isCurrentTrack = currentTrack?.id === track.id;
                  const hasAudio = !!(track.audioUrl320 || track.audioUrl128 || track.audioOriginal);
                  return (
                    <div
                      key={track.id}
                      onClick={() => hasAudio && handlePlayTrack(displayTracks, realIndex)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                        isCurrentTrack ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30' : 'hover:bg-[var(--color-surface-light)]'
                      } ${!hasAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-7 flex items-center justify-center flex-shrink-0">
                        {isCurrentTrack && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-1 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '60%'}}></span>
                            <span className="w-1 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '100%', animationDelay: '0.2s'}}></span>
                            <span className="w-1 bg-[var(--color-primary)] rounded-full animate-pulse" style={{height: '40%', animationDelay: '0.4s'}}></span>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-[#666] group-hover:hidden">{realIndex + 1}</span>
                            <svg className="w-4 h-4 text-white hidden group-hover:block" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </>
                        )}
                      </div>

                      <div className="w-12 h-12 rounded-md bg-[var(--color-surface-lighter)] flex-shrink-0 overflow-hidden">
                        {(track.coverUrl || track.album?.artwork) ? (
                          <img src={(track.coverUrl || track.album?.artwork)!} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#555]">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-medium truncate ${isCurrentTrack ? 'text-[var(--color-primary)]' : 'text-white'}`}>{track.title}</p>
                        <Link
                          href={`/artist/${track.artist?.slug || track.artistId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm text-[#888] truncate block hover:text-white hover:underline"
                        >
                          {track.artist?.name || 'Unknown Artist'}
                        </Link>
                      </div>

                      {(track.mood || track.genre) && (
                        <span className="hidden md:inline-block px-2 py-0.5 text-[10px] rounded-full bg-[var(--color-surface-lighter)] text-[#aaa] capitalize">
                          {track.mood || track.genre}
                        </span>
                      )}

                      <span className="text-xs text-[#666] w-10 text-right">
                        {track.duration > 0 ? formatTime(track.duration) : '--:--'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
      </div>

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
              <Link
                key={artist.id}
                href={`/artist/${artist.slug}`}
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
                <p className="text-sm md:text-base font-semibold text-white truncate group-hover:text-[var(--color-primary)]">{artist.name}</p>
                <p className="text-[11px] md:text-sm text-[var(--color-text-muted)] mt-0.5 md:mt-1">{Number(artist.totalStreams).toLocaleString()} streams</p>
              </Link>
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
        <Image src="/intube-media-logo.jpeg" alt="Intube Media" width={48} height={48} className="rounded-lg mx-auto mb-2" />
        <p className="text-sm text-[#888]">Intube Music</p>
        <p className="text-xs text-[#555] mt-1">A product of Intube Media</p>
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
