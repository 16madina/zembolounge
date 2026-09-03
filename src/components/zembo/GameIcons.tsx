/* Icônes illustrées des jeux Zembo (SVG, tokens du design system) */

function Grad({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
  );
}

export function BrainZIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <Grad id="gi-brain" from="oklch(0.93 0.1 95)" to="oklch(0.66 0.12 72)" />
      <path
        d="M25 10c-6 0-10 4-10 9-4 1-6 4-6 8s2 6 5 8c-1 5 3 9 8 9h3V10h-0.5zM39 10c6 0 10 4 10 9 4 1 6 4 6 8s-2 6-5 8c1 5-3 9-8 9h-3V10h0.5z"
        stroke="url(#gi-brain)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M25 26h13l-13 12h13"
        stroke="url(#gi-brain)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThroneIcon({ size = 64, color = "oklch(0.68 0.22 350)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M20 12l5 7 7-9 7 9 5-7v10H20V12z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <rect x="18" y="24" width="28" height="20" rx="4" stroke={color} strokeWidth="2.2" />
      <path d="M18 44v10M46 44v10M14 34h4M46 34h4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function VersusIcon({ size = 64 }: { size?: number }) {
  const blue = "oklch(0.66 0.19 250)";
  const pink = "oklch(0.68 0.22 350)";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M6 52c0-9 5-14 11-16 2-4 1-8-1-11 0-6 4-10 9-10s8 4 8 10c0 4-2 6-2 9"
        stroke={blue}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M58 52c0-9-5-14-11-16-2-4-1-8 1-11 0-6-4-10-9-10s-8 4-8 10c0 4 2 6 2 9"
        stroke={pink}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="oklch(0.9 0.09 92)"
      >
        VS
      </text>
    </svg>
  );
}

export function BubblesIcon({ size = 64, color = "oklch(0.75 0.17 155)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M8 18a5 5 0 015-5h20a5 5 0 015 5v11a5 5 0 01-5 5H19l-8 6v-6a5 5 0 01-3-5V18z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M26 32a5 5 0 015-5h20a5 5 0 015 5v11a5 5 0 01-5 5h-6l-8 6v-6h-6a5 5 0 01-5-5V32z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <text x="45" y="44" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>
        ?
      </text>
    </svg>
  );
}

export function TrophyZIcon({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <Grad id="gi-trophy" from="oklch(0.94 0.1 95)" to="oklch(0.6 0.12 70)" />
      <path
        d="M28 16h40v18c0 12-9 20-20 20S28 46 28 34V16z"
        stroke="url(#gi-trophy)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M28 22h-9c0 10 4 15 11 16M68 22h9c0 10-4 15-11 16M48 54v14M34 80h28l-3-12H37l-3 12z"
        stroke="url(#gi-trophy)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M40 26h16l-16 14h16" stroke="url(#gi-trophy)" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/** Socle de podium avec grand Z or */
export function PodiumBase({ width = 132 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.34} viewBox="0 0 132 45" fill="none" aria-hidden="true">
      <Grad id="gi-podium" from="oklch(0.92 0.1 95)" to="oklch(0.6 0.12 70)" />
      <path d="M6 6h120l-10 38H16L6 6z" fill="oklch(0.13 0.01 60)" stroke="oklch(0.82 0.13 85 / 45%)" />
      <path
        d="M50 15h32l-32 20h32"
        stroke="url(#gi-podium)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NeonFacesIcon({ size = 46 }: { size?: number }) {
  const blue = "oklch(0.68 0.19 250)";
  const pink = "oklch(0.7 0.22 350)";
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 46 30" fill="none" aria-hidden="true">
      <path d="M4 27c0-6 4-9 7-10-1-3-1-6 0-8 1-4 8-5 9 0 1 3 0 5-1 7" stroke={blue} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M42 27c0-6-4-9-7-10 1-3 1-6 0-8-1-4-8-5-9 0-1 3 0 5 1 7" stroke={pink} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 6l-3 8h4l-3 8" stroke="oklch(0.7 0.19 250)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
