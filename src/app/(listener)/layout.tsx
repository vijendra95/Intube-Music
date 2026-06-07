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
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a2e] to-[var(--color-surface)] pb-[60px] md:pb-0">
          {children}
        </main>
      </div>
      <div className="hidden md:block">
        <Player />
      </div>
      {/* Mobile player - mini version above bottom nav */}
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40">
        <Player />
      </div>
    </div>
  );
}
