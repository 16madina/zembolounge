export function ZemboIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="zg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.93 0.1 95)" />
          <stop offset="100%" stopColor="oklch(0.62 0.12 72)" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17.5" stroke="url(#zg)" strokeWidth="2" />
      <path d="M13 14h14l-14 12h14" stroke="url(#zg)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function ZemboWordmark({ className = "text-[19px]" }: { className?: string }) {
  return (
    <span
      className={`text-gold-gradient font-extrabold tracking-[0.28em] ${className}`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      ZEMBO
    </span>
  );
}
