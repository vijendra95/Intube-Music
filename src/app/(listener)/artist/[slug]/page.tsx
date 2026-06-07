'use client';

import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/types';

interface ArtistProfile {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  verified: boolean;
  monthlyListeners: number;
  totalStreams: number;
  country: string | null;
  genres: string[];
  socialLinks: Record<string, string> | null;
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
  artist?: ArtistProfile | null;
  album?: { id: string; title: string; slug: string; artwork: string | null; } | null;
}

const socialIcons: Record<string, { icon: string; label: string; baseUrl?: string }> = {
  youtube: { icon: '📺', label: 'YouTube' },
  instagram: { icon: '📷', label: 'Instagram' },
  twitter: { icon: '🐦', label: 'Twitter / X' },
  facebook: { icon: '👤', label: 'Facebook' },
  spotify: { icon: '🎵', label: 'Spotify' },
  website: { icon: '🌐', label: 'Website' },
  tiktok: { icon: '🎬', label: 'TikTok' },
};

export default function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue, currentTrack, isPlaying } = usePlayerStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/artists/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) return;
        setArtist(data.artist || data);
        const artistId = (data.artist || data).id;
        return fetch(`/api/tracks?artistId=${artistId}&limit=50&published=true`);
      })
      .then(r => r?.json())
      .then(data => {
        if (data) setTracks(Array.isArray(data) ? data : (data.tracks || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePlayTrack = (index: number) => {
    const playable = tracks.filter(t => t.audioUrl320 || t.audioUrl128 || t.audioOriginal);
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
    const clicked = tracks[index];
    const realIdx = playable.findIndex(t => t.id === clicked.id);
    if (realIdx >= 0) setQueue(mapped, realIdx);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) handlePlayTrack(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-xl text-[#888]">Artist not found</p>
        <Link href="/" className="text-[var(--color-primary)] hover:underline">Go Home</Link>
      </div>
    );
  }

  const parsedGenres = typeof artist.genres === 'string' ? (() => { try { return JSON.parse(artist.genres); } catch { return []; } })() : (artist.genres || []);
  const parsedSocialLinks = typeof artist.socialLinks === 'string' ? (() => { try { return JSON.parse(artist.socialLinks); } catch { return {}; } })() : (artist.socialLinks || {});

  return (
    <div className="pb-32 md:pb-8">
      {/* Hero / Cover */}
      <div className="relative h-64 md:h-80">
        {artist.coverImage ? (
          <img src={artist.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a3e] via-[#2a1a4e] to-[#1a2a3e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-[#0f0f23]/60 to-transparent" />

        {/* Artist Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end gap-5">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-[var(--color-surface-lighter)] flex-shrink-0 overflow-hidden shadow-2xl border-4 border-[#0f0f23]">
            {artist.avatar ? (
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#555]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {artist.verified && (
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                <span className="text-xs text-blue-400 font-medium">Verified Artist</span>
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white truncate">{artist.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#aaa]">
              <span>{Number(artist.monthlyListeners).toLocaleString()} monthly listeners</span>
              <span>{Number(artist.totalStreams).toLocaleString()} total streams</span>
            </div>
            {artist.country && <p className="text-xs text-[#888] mt-1">{artist.country}</p>}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Action buttons */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handlePlayAll}
            className="px-6 py-3 bg-[var(--color-primary)] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Play All
          </button>
        </div>

        {/* Genres */}
        {parsedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {parsedGenres.map((g: string) => (
              <span key={g} className="px-3 py-1 text-xs font-medium bg-[var(--color-surface-light)] text-[#ccc] rounded-full capitalize">{g}</span>
            ))}
          </div>
        )}

        {/* Bio */}
        {artist.bio && (
          <div className="mb-8 max-w-3xl">
            <h2 className="text-lg font-bold text-white mb-2">About</h2>
            <p className="text-sm text-[#aaa] leading-relaxed whitespace-pre-wrap">{artist.bio}</p>
          </div>
        )}

        {/* Social Links */}
        {Object.keys(parsedSocialLinks).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3">Connect</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(parsedSocialLinks).map(([platform, url]) => {
                const info = socialIcons[platform.toLowerCase()] || { icon: '🔗', label: platform };
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] rounded-lg transition-colors"
                  >
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-sm font-medium text-[#ccc]">{info.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Tracks */}
        {tracks.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Songs ({tracks.length})</h2>
            <div className="space-y-1">
              {tracks.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                const hasAudio = !!(track.audioUrl320 || track.audioUrl128 || track.audioOriginal);
                return (
                  <div
                    key={track.id}
                    onClick={() => hasAudio && handlePlayTrack(index)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group ${
                      isCurrentTrack ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30' : 'hover:bg-[var(--color-surface-light)]'
                    } ${!hasAudio ? 'opacity-50' : ''}`}
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
                          <span className="text-sm text-[#666] group-hover:hidden">{index + 1}</span>
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
                      <p className="text-sm text-[#888] truncate">{track.genre || ''}</p>
                    </div>

                    <span className="text-xs text-[#666] w-10 text-right">
                      {track.duration > 0 ? formatTime(track.duration) : '--:--'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tracks.length === 0 && (
          <p className="text-[#888] text-center py-12">No songs available yet</p>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
