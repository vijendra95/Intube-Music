'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/search', label: 'Search', icon: SearchIcon },
  { href: '/browse', label: 'Browse', icon: BrowseIcon },
  { href: '/charts', label: 'Charts', icon: ChartIcon },
];

const libraryItems = [
  { href: '/library', label: 'Your Library', icon: LibraryIcon },
  { href: '/library/liked', label: 'Liked Songs', icon: HeartIcon },
  { href: '/library/playlists', label: 'Playlists', icon: PlaylistIcon },
  { href: '/library/artists', label: 'Artists', icon: ArtistIcon },
  { href: '/library/albums', label: 'Albums', icon: AlbumIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-[#0a0a0a] flex-col h-full border-r border-[var(--color-border)]">
        {/* Logo */}
        <div className="p-5 pb-6">
          <Link href="/">
            <Logo size={40} showText={true} />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 mb-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all',
                  isActive
                    ? 'text-white bg-[var(--color-surface-light)]'
                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)]/50'
                )}
              >
                <Icon active={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-6 border-t border-[var(--color-border)]" />

        {/* Library */}
        <nav className="px-3 mt-5 flex-1 overflow-y-auto">
          <p className="px-4 mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Your Library
          </p>
          {libraryItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-2.5 rounded-xl text-[15px] transition-all',
                  isActive
                    ? 'text-white bg-[var(--color-surface-light)]'
                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)]/50'
                )}
              >
                <Icon active={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[var(--color-border)] space-y-1">
          <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-[var(--color-text-secondary)] hover:text-white transition-colors rounded-xl hover:bg-[var(--color-surface)]/50">
            <UserIcon />
            Login / Sign Up
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 px-3 min-w-[60px] transition-all',
                  isActive ? 'text-[#1ed760]' : 'text-[#b3b3b3]'
                )}
              >
                <Icon active={isActive} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/library"
            className={cn(
              'flex flex-col items-center gap-1 py-2.5 px-3 min-w-[60px] transition-all',
              pathname?.startsWith('/library') ? 'text-[#1ed760]' : 'text-[#b3b3b3]'
            )}
          >
            <LibraryIcon active={pathname?.startsWith('/library')} />
            <span className="text-[11px] font-medium">Library</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.5' : '2'}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function BrowseIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ChartIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.5' : '2'}>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function LibraryIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function HeartIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PlaylistIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.5' : '2'}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3" y2="6" />
      <line x1="3" y1="12" x2="3" y2="12" />
      <line x1="3" y1="18" x2="3" y2="18" />
    </svg>
  );
}

function ArtistIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function AlbumIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
