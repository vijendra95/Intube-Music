'use client';

import { useRef, useEffect, useCallback } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/utils';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    progress,
    duration,
    repeat,
    shuffle,
    setIsPlaying,
    setProgress,
    setDuration,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const audioUrl = currentTrack.audioUrl320 || currentTrack.audioUrl128 || '';
    if (audioUrl && audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
  }, [setProgress]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }, [setDuration]);

  const handleEnded = useCallback(() => {
    if (repeat === 'one') {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      nextTrack();
    }
  }, [repeat, nextTrack]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
    setProgress(audio.currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  if (!currentTrack) {
    return (
      <div className="h-24 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] text-base">Select a song to start listening</p>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-24 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center px-4 gap-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Track Info */}
      <div className="flex items-center gap-3 w-64 min-w-0">
        <div className="w-14 h-14 rounded bg-[var(--color-surface-light)] flex-shrink-0 overflow-hidden">
          {currentTrack.album?.artwork ? (
            <img src={currentTrack.album.artwork} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MusicNoteIcon />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium text-white truncate">{currentTrack.title}</p>
          <p className="text-sm text-[var(--color-text-secondary)] truncate">
            {currentTrack.artist?.name}
          </p>
        </div>
        <button className="text-[var(--color-text-secondary)] hover:text-white ml-2 flex-shrink-0">
          <HeartIcon />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`${shuffle ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'} hover:text-white transition-colors`}
          >
            <ShuffleIcon />
          </button>
          <button onClick={prevTrack} className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
            <PrevIcon />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button onClick={nextTrack} className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
            <NextIcon />
          </button>
          <button
            onClick={toggleRepeat}
            className={`${repeat !== 'off' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'} hover:text-white transition-colors relative`}
          >
            <RepeatIcon />
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 text-[8px] font-bold text-[var(--color-primary)]">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-lg flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)] w-10 text-right">
            {formatDuration(Math.floor(progress))}
          </span>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-[var(--color-surface-lighter)] rounded-full cursor-pointer group relative"
          >
            <div
              className="h-full bg-white group-hover:bg-[var(--color-primary)] rounded-full transition-colors relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] w-10">
            {formatDuration(Math.floor(duration))}
          </span>
        </div>
      </div>

      {/* Volume & Extra Controls */}
      <div className="flex items-center gap-3 w-48 justify-end">
        <button className="text-[var(--color-text-secondary)] hover:text-white">
          <LyricsIcon />
        </button>
        <button className="text-[var(--color-text-secondary)] hover:text-white">
          <QueueIcon />
        </button>
        <button onClick={toggleMute} className="text-[var(--color-text-secondary)] hover:text-white">
          {isMuted || volume === 0 ? <VolumeMuteIcon /> : volume < 0.5 ? <VolumeLowIcon /> : <VolumeHighIcon />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 accent-white cursor-pointer"
        />
      </div>
    </div>
  );
}

function MusicNoteIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
}
function HeartIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
}
function ShuffleIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>;
}
function PrevIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>;
}
function PlayIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="black"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
function PauseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="black"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>;
}
function NextIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zm-10 0l8.5 6L6 18z" /></svg>;
}
function RepeatIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>;
}
function LyricsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>;
}
function QueueIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3" y2="6" /><line x1="3" y1="12" x2="3" y2="12" /><line x1="3" y1="18" x2="3" y2="18" /></svg>;
}
function VolumeHighIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>;
}
function VolumeLowIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>;
}
function VolumeMuteIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>;
}
