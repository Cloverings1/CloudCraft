type Star = { cx: number; cy: number; r: number; o: number; d: string };

const stars: Star[] = [
  { cx: 64, cy: 62, r: 1.4, o: 0.55, d: "0s" },
  { cx: 118, cy: 98, r: 1.1, o: 0.35, d: "0.6s" },
  { cx: 165, cy: 54, r: 0.9, o: 0.4, d: "1.2s" },
  { cx: 220, cy: 90, r: 1.2, o: 0.5, d: "0.9s" },
  { cx: 292, cy: 68, r: 1.6, o: 0.6, d: "1.7s" },
  { cx: 342, cy: 116, r: 1.0, o: 0.35, d: "2.1s" },
  { cx: 412, cy: 72, r: 1.3, o: 0.45, d: "0.3s" },
  { cx: 478, cy: 102, r: 1.1, o: 0.4, d: "1.9s" },
  { cx: 545, cy: 78, r: 0.9, o: 0.3, d: "2.4s" },
  { cx: 612, cy: 108, r: 1.2, o: 0.5, d: "0.8s" },
  { cx: 684, cy: 62, r: 1.7, o: 0.55, d: "1.5s" },
  { cx: 742, cy: 96, r: 1.1, o: 0.4, d: "2.6s" },
  { cx: 822, cy: 70, r: 1.4, o: 0.5, d: "0.2s" },
  { cx: 910, cy: 112, r: 1.0, o: 0.32, d: "1.1s" },
  { cx: 70, cy: 160, r: 1.0, o: 0.35, d: "2.8s" },
  { cx: 142, cy: 190, r: 1.5, o: 0.55, d: "1.4s" },
  { cx: 212, cy: 164, r: 1.1, o: 0.4, d: "0.5s" },
  { cx: 286, cy: 206, r: 0.9, o: 0.35, d: "2.0s" },
  { cx: 356, cy: 168, r: 1.3, o: 0.5, d: "1.0s" },
  { cx: 430, cy: 214, r: 1.0, o: 0.4, d: "2.3s" },
  { cx: 512, cy: 178, r: 1.4, o: 0.55, d: "0.7s" },
  { cx: 596, cy: 224, r: 0.9, o: 0.3, d: "1.8s" },
  { cx: 676, cy: 170, r: 1.2, o: 0.45, d: "2.7s" },
  { cx: 758, cy: 206, r: 1.1, o: 0.4, d: "0.4s" },
  { cx: 840, cy: 176, r: 1.5, o: 0.55, d: "1.6s" },
  { cx: 924, cy: 220, r: 0.9, o: 0.33, d: "2.2s" },
  { cx: 110, cy: 260, r: 1.2, o: 0.45, d: "1.9s" },
  { cx: 196, cy: 290, r: 1.0, o: 0.35, d: "0.9s" },
  { cx: 276, cy: 260, r: 1.4, o: 0.55, d: "2.5s" },
  { cx: 360, cy: 302, r: 1.0, o: 0.4, d: "1.3s" },
  { cx: 452, cy: 272, r: 1.2, o: 0.45, d: "0.2s" },
  { cx: 546, cy: 316, r: 0.9, o: 0.32, d: "2.9s" },
  { cx: 642, cy: 278, r: 1.5, o: 0.55, d: "1.0s" },
  { cx: 734, cy: 310, r: 1.1, o: 0.4, d: "0.6s" },
  { cx: 826, cy: 276, r: 1.3, o: 0.5, d: "2.1s" },
  { cx: 920, cy: 318, r: 1.0, o: 0.36, d: "1.7s" },
];

const trees = [
  { x: 120, y: 380, s: 1.0 },
  { x: 185, y: 356, s: 1.1 },
  { x: 260, y: 392, s: 0.9 },
  { x: 330, y: 368, s: 1.05 },
];

export default function WiseInspiredBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base canvas */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255, 255, 255, 0.06), transparent 60%)," +
            "radial-gradient(ellipse 55% 45% at 75% 14%, rgba(34, 211, 238, 0.04), transparent 65%)," +
            "linear-gradient(180deg, #0B0B0B 0%, #07070A 55%, #050508 100%)",
        }}
      />

      {/* Scene illustration */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="cc-moon" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.18" />
          </radialGradient>
          <filter id="cc-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stars */}
        <g>
          {stars.map((s, i) => (
            <circle
              key={i}
              className="cc-star"
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="#FFFFFF"
              opacity={s.o}
              style={{ animationDelay: s.d }}
            />
          ))}
        </g>

        {/* Moon */}
        <g filter="url(#cc-soft-glow)">
          <circle cx="770" cy="120" r="46" fill="url(#cc-moon)" />
        </g>

        {/* Subtle haze near horizon */}
        <rect x="0" y="320" width="1000" height="200" fill="#0E0E12" opacity="0.18" />

        {/* Left terrain (forest) - far */}
        <path
          d="M0 600V420H70V392H130V360H190V392H250V420H340V600Z"
          fill="#0B0C10"
          opacity="0.6"
        />
        {/* Left terrain (forest) - near */}
        <path
          d="M0 600V470H60V438H110V410H160V380H220V410H275V438H340V470H420V600Z"
          fill="#101218"
          opacity="0.92"
        />

        {/* Trees */}
        <g opacity="0.9">
          {trees.map((t, i) => (
            <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
              {/* trunk */}
              <rect x="14" y="40" width="12" height="38" fill="#0B0B0E" opacity="0.9" />
              {/* canopy blocks */}
              <rect x="0" y="18" width="40" height="28" fill="#121622" opacity="0.82" />
              <rect x="10" y="0" width="40" height="28" fill="#0F131C" opacity="0.92" />
              <rect x="-14" y="6" width="40" height="28" fill="#171E2C" opacity="0.48" />
            </g>
          ))}
        </g>

        {/* Right terrain (stone) - far */}
        <path
          d="M1000 600V350H920V322H860V290H790V260H700V600Z"
          fill="#0F121A"
          opacity="0.62"
        />
        {/* Right terrain (stone) - near */}
        <path
          d="M1000 600V420H940V392H885V360H820V330H740V300H660V600Z"
          fill="#1C2430"
          opacity="0.92"
        />

        {/* Edge highlights (very subtle) */}
        <path
          d="M0 470H60V438H110V410H160V380H220V410H275V438H340V470H420"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
          strokeLinejoin="miter"
        />
        <path
          d="M1000 420H940V392H885V360H820V330H740V300H660"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
          strokeLinejoin="miter"
        />
      </svg>

      {/* Readability layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-[var(--bg-primary)]" />
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  );
}


