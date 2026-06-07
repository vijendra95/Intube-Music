'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/upload', label: 'Upload Music', icon: '🎵' },
  { href: '/admin/tracks', label: 'All Tracks', icon: '🎶' },
  { href: '/admin/artists', label: 'Artists', icon: '🎤' },
  { href: '/admin/labels', label: 'Labels', icon: '🏷️' },
  { href: '/admin/albums', label: 'Albums', icon: '💿' },
  { href: '/admin/playlists', label: 'Playlists', icon: '📋' },
  { href: '/admin/banners', label: 'Banners', icon: '🖼️' },
  { href: '/admin/genres', label: 'Genres & Moods', icon: '🎭' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="h-screen flex bg-[#0f0f23]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#1a1a2e] border-r border-[#2a2a4a] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#2a2a4a]">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">IM</span>
            </div>
            <div>
              <span className="text-base font-bold text-white">Intube Music</span>
              <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1',
                  isActive
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                    : 'text-[#8888aa] hover:text-white hover:bg-[#2a2a4a]'
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Panel Link */}
        <div className="p-4 border-t border-[#2a2a4a]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#8888aa] hover:text-white transition-colors rounded-lg hover:bg-[#2a2a4a]"
          >
            <span>🎧</span>
            Go to Player
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-[#1a1a2e]/80 backdrop-blur-sm border-b border-[#2a2a4a] flex items-center justify-between px-6">
          <h2 className="text-sm font-medium text-[#8888aa]">
            Admin Console
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8888aa]" suppressHydrationWarning>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
