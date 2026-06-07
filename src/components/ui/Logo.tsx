import Image from 'next/image';

export function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image src="/intube-media-logo.jpeg" alt="Intube Media" width={size} height={size} className="rounded-lg" />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold bg-gradient-to-r from-[#1ed760] via-[#00d4aa] to-[#0099ff] bg-clip-text text-transparent">
            Intube Music
          </span>
          <span className="text-[10px] font-medium tracking-wide text-[var(--color-text-muted)]">
            by Intube Media
          </span>
        </div>
      )}
    </div>
  );
}
