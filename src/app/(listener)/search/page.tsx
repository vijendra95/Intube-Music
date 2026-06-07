'use client';

import { useState } from 'react';
import Link from 'next/link';

const browseCategories = [
  { id: '1', name: 'Bollywood', color: 'from-pink-600 to-rose-500' },
  { id: '2', name: 'Hip Hop', color: 'from-yellow-600 to-orange-500' },
  { id: '3', name: 'Pop', color: 'from-purple-600 to-pink-500' },
  { id: '4', name: 'Classical', color: 'from-amber-700 to-yellow-500' },
  { id: '5', name: 'Devotional', color: 'from-orange-600 to-red-500' },
  { id: '6', name: 'Punjabi', color: 'from-green-600 to-emerald-500' },
  { id: '7', name: 'Lo-Fi', color: 'from-indigo-600 to-blue-500' },
  { id: '8', name: 'Rock', color: 'from-red-700 to-red-500' },
  { id: '9', name: 'Sufi', color: 'from-teal-600 to-cyan-500' },
  { id: '10', name: 'Electronic', color: 'from-violet-600 to-purple-500' },
  { id: '11', name: 'Indie', color: 'from-sky-600 to-blue-400' },
  { id: '12', name: 'Ghazal', color: 'from-rose-700 to-pink-500' },
  { id: '13', name: 'Haryanvi', color: 'from-lime-600 to-green-500' },
  { id: '14', name: 'Rajasthani', color: 'from-orange-700 to-amber-500' },
  { id: '15', name: 'Bhojpuri', color: 'from-emerald-700 to-green-500' },
  { id: '16', name: 'Podcasts', color: 'from-blue-700 to-indigo-500' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ tracks?: unknown[]; artists?: unknown[]; albums?: unknown[] } | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      console.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 pb-4 bg-gradient-to-b from-[#1a1a2e] to-transparent">
        <div className="relative max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-12 pr-4 py-4 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-full text-base text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults(null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {query && results && (
        <div className="mb-8">
          {searching && (
            <p className="text-[var(--color-text-muted)] text-base">Searching...</p>
          )}
          {!searching && results.tracks && (results.tracks as unknown[]).length === 0 && results.artists && (results.artists as unknown[]).length === 0 && (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg text-white font-medium">No results for &quot;{query}&quot;</p>
              <p className="text-base text-[var(--color-text-muted)] mt-2">Try different keywords or browse categories below</p>
            </div>
          )}
        </div>
      )}

      {/* Browse Categories */}
      {!query && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {browseCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?genre=${cat.name.toLowerCase()}`}
                className={`relative overflow-hidden rounded-xl p-5 h-32 bg-gradient-to-br ${cat.color} hover:opacity-90 transition-opacity group`}
              >
                <span className="text-lg font-bold text-white">{cat.name}</span>
                {/* Decorative music note */}
                <svg className="absolute bottom-2 right-2 opacity-20 rotate-12 group-hover:rotate-0 transition-transform" width="48" height="48" viewBox="0 0 24 24" fill="white">
                  <path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM21 16c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
