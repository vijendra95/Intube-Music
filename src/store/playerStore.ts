'use client';

import { create } from 'zustand';
import { Track } from '@/types';

interface PlayerStore {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  currentMood: string | null;
  autoplay: boolean;

  setTrack: (track: Track) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setMood: (mood: string | null) => void;
  loadMoodTracks: (mood: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  progress: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  currentMood: null,
  autoplay: true,

  setTrack: (track) => {
    set({ currentTrack: track, isPlaying: true, progress: 0 });
  },

  setQueue: (tracks, startIndex = 0) => {
    set({
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
      isPlaying: true,
      progress: 0,
    });
  },

  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index) => {
    set((state) => {
      const newQueue = [...state.queue];
      newQueue.splice(index, 1);
      return { queue: newQueue };
    });
  },

  nextTrack: () => {
    const { queue, queueIndex, repeat, shuffle } = get();
    if (queue.length === 0) return;

    let nextIndex: number;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (queueIndex < queue.length - 1) {
      nextIndex = queueIndex + 1;
    } else if (repeat === 'all') {
      nextIndex = 0;
    } else {
      set({ isPlaying: false });
      return;
    }

    set({
      queueIndex: nextIndex,
      currentTrack: queue[nextIndex],
      progress: 0,
      isPlaying: true,
    });
  },

  prevTrack: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;

    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    set({
      queueIndex: prevIndex,
      currentTrack: queue[prevIndex],
      progress: 0,
      isPlaying: true,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  toggleRepeat: () =>
    set((state) => {
      const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
      const currentIdx = modes.indexOf(state.repeat);
      return { repeat: modes[(currentIdx + 1) % 3] };
    }),

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  setMood: (mood) => set({ currentMood: mood }),

  loadMoodTracks: async (mood) => {
    try {
      const res = await fetch(`/api/tracks?mood=${mood}`);
      if (res.ok) {
        const tracks = await res.json();
        if (tracks.length > 0) {
          set({
            currentMood: mood,
            queue: tracks,
            queueIndex: 0,
            currentTrack: tracks[0],
            isPlaying: true,
            progress: 0,
            repeat: 'all',
            autoplay: true,
          });
        }
      }
    } catch {
      // silently fail
    }
  },
}));
