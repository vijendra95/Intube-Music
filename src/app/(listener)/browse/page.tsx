'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/types';

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface Mood {
  id: string;
  name: string;
  slug: string;
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

const genreColors: Record<string, string> = {
  bollywood: 'from-pink-600 to-rose-500',
  pop: 'from-purple-600 to-pink-500',
  'hip-hop': 'from-yellow-600 to-orange-500',
  classical: 'from-amber-700 to-yellow-500',
  devotional: 'from-orange-600 to-red-500',
  folk: 'from-green-700 to-emerald-500',
  sufi: 'from-teal-600 to-cyan-500',
  rock: 'from-red-700 to-red-500',
  electronic: 'from-violet-600 to-purple-500',
  indie: 'from-sky-600 to-blue-400',
  punjabi: 'from-green-600 to-emerald-500',
  haryanvi: 'from-lime-600 to-green-500',
  rajasthani: 'from-orange-700 to-amber-500',
  bhojpuri: 'from-emerald-700 to-green-500',
  ghazal: 'from-rose-700 to-pink-500',
  'lo-fi': 'from-indigo-600 to-blue-500',
};

const moodColors: Record<string, string> = {
  happy: 'from-yellow-500 to-orange-400',
  sad: 'from-blue-600 to-indigo-500',
  romantic: 'from-pink-500 to-red-400',
  party: 'from-purple-500 to-pink-400',
  chill: 'from-cyan-500 to-teal-400',
  focus: 'from-green-500 to-emerald-400',
  workout: 'from-red-500 to-orange-400',
  sleep: 'from-indigo-600 to-purple-500',
  energetic: 'from-orange-500 to-yellow-400',
  melancholy: 'from-slate-600 to-blue-500',
  peaceful: 'from-teal-500 to-green-400',
  angry: 'from-red-700 to-red-500',
};

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-6"><p className="text-white">Loading...</p></div>}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const moodFilter = searchParams.get('mood');
  const genreFilter = searchParams.get('genre');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<TrackData[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const { setQueue, currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    fetch('/api/genres').then(r => r.json()).then(data => setGenres(data.genres || [])).catch(() => {});
    fetch('/api/moods').then(r => r.json()).then(data => setMoods(data.moods || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (moodFilter || genreFilter) {
      setLoadingTracks(true);
      const params = new URLSearchParams({ limit: '50', published: 'true' });
      if (moodFilter) params.set('mood', moodFilter);
      if (genreFilter) params.set('genre', genreFilter);
      fetch(`/api/tracks?${params.toString()}`).then(r => r.json()).then(data => {
        setFilteredTracks(data.tracks || []);
      }).catch(() => {}).finally(() => setLoadingTracks(false));
    }
  }, [moodFilter, genreFilter]);

  const handlePlayTrack = (index: number) => {
    const playable = filteredTracks.filter(t => t.audioUrl320 || t.audioUrl128 || t.audioOriginal);
    const mapped: Track[] = playable.map(t => ({
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
    }));
    const clicked = filteredTracks[index];
    const realIdx = playable.findIndex(t => t.id === clicked.id);
    if (realIdx >= 0) setQueue(mapped, realIdx);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Browse</h1>

      {moodFilter && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/browse" className="text-[var(--color-primary)] hover:underline text-sm">← Back</Link>
            <h2 className="text-xl font-bold text-white">{moodFilter.charAt(0).toUpperCase() + moodFilter.slice(1)} Music</h2>
          </div>
          {loadingTracks ? (
            <p className="text-[#8888aa]">Loading tracks...</p>
          ) : filteredTracks.length === 0 ? (
            <p className="text-[#8888aa]">No tracks found for this mood. Upload songs with &quot;{moodFilter}&quot; mood from admin.</p>
          ) : (
            <div className="space-y-1">
              {filteredTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const hasAudio = !!(track.audioUrl320 || track.audioUrl128 || track.audioOriginal);
                return (
                  <div
                    key={track.id}
                    onClick={() => hasAudio && handlePlayTrack(idx)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group ${isCurrent ? 'bg-[var(--color-primary)]/10' : 'hover:bg-[var(--color-surface-light)]'} ${!hasAudio ? 'opacity-50' : ''}`}
                  >
                    <div className="w-8 text-center">
                      {isCurrent && isPlaying ? (
                        <span className="text-[var(--color-primary)] text-xs">▶</span>
                      ) : (
                        <span className="text-sm text-[#8888aa]">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-[var(--color-primary)]' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-[#8888aa] truncate">{track.artist?.name || 'Unknown'}</p>
                    </div>
                    <span className="text-xs text-[#8888aa]">{track.genre || ''}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {genreFilter && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/browse" className="text-[var(--color-primary)] hover:underline text-sm">← Back</Link>
            <h2 className="text-xl font-bold text-white capitalize">{genreFilter} Music</h2>
          </div>
          {loadingTracks ? (
            <p className="text-[#8888aa]">Loading tracks...</p>
          ) : filteredTracks.length === 0 ? (
            <p className="text-[#8888aa]">No tracks found for this genre.</p>
          ) : (
            <div className="space-y-1">
              {filteredTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const hasAudio = !!(track.audioUrl320 || track.audioUrl128 || track.audioOriginal);
                return (
                  <div
                    key={track.id}
                    onClick={() => hasAudio && handlePlayTrack(idx)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group ${isCurrent ? 'bg-[var(--color-primary)]/10' : 'hover:bg-[var(--color-surface-light)]'} ${!hasAudio ? 'opacity-50' : ''}`}
                  >
                    <div className="w-8 text-center">
                      {isCurrent && isPlaying ? (
                        <span className="text-[var(--color-primary)] text-xs">▶</span>
                      ) : (
                        <span className="text-sm text-[#8888aa]">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isCurrent ? 'text-[var(--color-primary)]' : 'text-white'}`}>{track.title}</p>
                      <p className="text-xs text-[#8888aa] truncate">{track.artist?.name || 'Unknown'}</p>
                    </div>
                    <span className="text-xs text-[#8888aa] capitalize">{track.mood || ''}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!moodFilter && !genreFilter && (
        <>
          {/* Moods Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Moods</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <Link
                  key={mood.id}
                  href={`/browse?mood=${mood.slug}`}
                  className={`relative overflow-hidden rounded-xl p-5 h-28 bg-gradient-to-br ${moodColors[mood.slug] || 'from-gray-600 to-gray-500'} hover:opacity-90 transition-opacity`}
                >
                  <span className="text-lg font-bold text-white">{mood.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Genres Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/browse?genre=${genre.slug}`}
                  className={`relative overflow-hidden rounded-xl p-5 h-28 bg-gradient-to-br ${genreColors[genre.slug] || 'from-gray-600 to-gray-500'} hover:opacity-90 transition-opacity`}
                >
                  <span className="text-lg font-bold text-white">{genre.name}</span>
                  <svg className="absolute bottom-2 right-2 opacity-20 rotate-12" width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM21 16c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
