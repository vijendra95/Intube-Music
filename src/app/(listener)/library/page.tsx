'use client';

import Link from 'next/link';

export default function LibraryPage() {
  const sections = [
    { href: '/library/liked', icon: '❤️', name: 'Liked Songs', count: 0 },
    { href: '/library/playlists', icon: '🎵', name: 'Playlists', count: 0 },
    { href: '/library/artists', icon: '🎤', name: 'Artists', count: 0 },
    { href: '/library/albums', icon: '💿', name: 'Albums', count: 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Your Library</h1>
      <div className="space-y-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-light)]/80 transition-colors"
          >
            <span className="text-3xl">{section.icon}</span>
            <div>
              <h3 className="text-lg font-medium text-white">{section.name}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{section.count} items</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-center text-[var(--color-text-muted)] mt-12 text-base">
        Login to see your saved music
      </p>
    </div>
  );
}
