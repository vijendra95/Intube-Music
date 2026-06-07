'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

  useEffect(() => {
    fetch('/api/genres').then(r => r.json()).then(data => setGenres(data.genres || [])).catch(() => {});
    fetch('/api/moods').then(r => r.json()).then(data => setMoods(data.moods || [])).catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Browse</h1>

      {moodFilter && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 capitalize">{moodFilter} Music</h2>
          <p className="text-[var(--color-text-muted)] text-base">Showing tracks matching your mood: {moodFilter}</p>
          <Link href="/browse" className="text-[var(--color-primary)] hover:underline text-sm mt-2 inline-block">← Back to Browse</Link>
        </div>
      )}

      {genreFilter && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 capitalize">{genreFilter} Music</h2>
          <p className="text-[var(--color-text-muted)] text-base">Showing tracks in genre: {genreFilter}</p>
          <Link href="/browse" className="text-[var(--color-primary)] hover:underline text-sm mt-2 inline-block">← Back to Browse</Link>
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
