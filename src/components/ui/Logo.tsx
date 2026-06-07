export function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1ed760" />
            <stop offset="50%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#0099ff" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ffa500" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#logoGrad1)" opacity="0.15"/>
        <circle cx="100" cy="100" r="90" stroke="url(#logoGrad1)" strokeWidth="3" fill="none"/>
        <path d="M100 25 L160 60 L160 140 L100 175 L40 140 L40 60 Z" fill="url(#logoGrad1)" opacity="0.1" stroke="url(#logoGrad1)" strokeWidth="1.5"/>
        <path d="M80 65 L140 100 L80 135 Z" fill="url(#logoGrad1)" opacity="0.9"/>
        <path d="M150 75 C165 85 165 115 150 125" stroke="url(#logoGrad2)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M158 65 C178 80 178 120 158 135" stroke="url(#logoGrad2)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
        <circle cx="55" cy="145" r="6" fill="url(#logoGrad2)" opacity="0.8"/>
        <line x1="61" y1="145" x2="61" y2="120" stroke="url(#logoGrad2)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
        <path d="M61 120 C61 115 72 112 72 117" stroke="url(#logoGrad2)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      </svg>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold bg-gradient-to-r from-[#1ed760] via-[#00d4aa] to-[#0099ff] bg-clip-text text-transparent">
            Intube
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
            Music
          </span>
        </div>
      )}
    </div>
  );
}
