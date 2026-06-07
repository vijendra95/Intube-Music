import Sidebar from '@/components/layout/Sidebar';
import Player from '@/components/player/Player';

export default function ListenerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a2e] to-[var(--color-surface)]">
          {children}
        </main>
      </div>
      <Player />
    </div>
  );
}
