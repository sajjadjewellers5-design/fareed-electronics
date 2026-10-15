import React from 'react';

interface BrandLogoProps {
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  className?: string;
  animated?: boolean;
}

/**
 * Previous Official Fareed Electronics Tech Emblem
 * - Metallic silver-white beveled "F" stem
 * - Electric cyan circuit board traces & solder contact pads
 * - Electric cyan glowing lightning bolt
 * - Micro typography: FAREED ELECTRONICS
 */
export const FareedElectronicsBadge: React.FC<{
  size?: number | string;
  className?: string;
  animated?: boolean;
}> = ({ size = 64, className = '', animated = false }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-[#0a1324] to-[#040811] border border-cyan-500/40 p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/20 select-none overflow-hidden ${
        animated ? 'animate-pulse drop-shadow-[0_0_30px_rgba(6,182,212,0.7)]' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient background cyan aura */}
      <div className="absolute inset-0 bg-cyan-500/15 rounded-xl filter blur-[3px] pointer-events-none" />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_6px_rgba(34,211,238,0.7)] relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic silver-white gradient */}
          <linearGradient id="silverBevelPrev" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#d1d5db" />
            <stop offset="70%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </linearGradient>

          {/* Electric Cyan circuit gradient */}
          <linearGradient id="cyanCircuitPrev" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="boltGlowPrev" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main 'F' stem with circuit tracks */}
        <path
          d="M 22 18 L 48 18 L 48 27 L 34 27 L 34 40 L 44 40 L 44 49 L 34 49 L 34 76 L 22 76 Z"
          fill="url(#silverBevelPrev)"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Cyan Circuit Board Traces on Stem */}
        <path
          d="M 26 24 L 26 70 M 26 34 L 31 34 M 26 58 L 31 58 M 26 44 L 29 47 L 29 52"
          stroke="url(#cyanCircuitPrev)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="24" r="1.8" fill="#a5f3fc" />
        <circle cx="31" cy="34" r="1.6" fill="#38bdf8" />
        <circle cx="31" cy="58" r="1.6" fill="#38bdf8" />
        <circle cx="26" cy="70" r="1.8" fill="#a5f3fc" />

        {/* Horizontal top bar extension */}
        <path
          d="M 44 18 L 64 18 L 59 27 L 44 27 Z"
          fill="url(#silverBevelPrev)"
        />

        {/* Electric Cyan Lightning Bolt on Top Right of 'F' */}
        <g filter="url(#boltGlowPrev)">
          <path
            d="M 68 10 L 57 26 L 66 26 L 56 42 L 75 22 L 66 22 Z"
            fill="#38bdf8"
            stroke="#e0f2fe"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>

        {/* Sub-badge micro typography */}
        <text
          x="50"
          y="86"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="8.5"
          fontWeight="900"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          FAREED
        </text>
        <text
          x="50"
          y="94"
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="4.5"
          fontWeight="700"
          letterSpacing="1.2"
          fontFamily="sans-serif"
        >
          ELECTRONICS
        </text>
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  customLogoUrl,
  size = 'md',
  showSubtitle = true,
  className = '',
  animated = false,
}) => {
  const sizeMap = {
    sm: { badge: 32, textTitle: 'text-sm', textSub: 'text-[9px]' },
    md: { badge: 44, textTitle: 'text-base font-extrabold', textSub: 'text-[10px]' },
    lg: { badge: 60, textTitle: 'text-xl font-black', textSub: 'text-xs' },
    xl: { badge: 84, textTitle: 'text-2xl font-black', textSub: 'text-sm' },
    '2xl': { badge: 120, textTitle: 'text-3xl font-black', textSub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Badge container with tech glow */}
      <div className="relative shrink-0 flex items-center justify-center">
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Fareed Electronics Logo"
            className="w-full h-full object-contain rounded-xl"
            style={{ width: currentSize.badge, height: currentSize.badge }}
          />
        ) : (
          <FareedElectronicsBadge
            size={currentSize.badge}
            animated={animated}
          />
        )}
      </div>

      {/* Brand Name & Official Lab Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`tracking-tight uppercase text-white font-extrabold ${currentSize.textTitle} drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}>
            FAREED
          </span>
          <span
            className={`tracking-tight uppercase font-extrabold ${currentSize.textTitle} bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent`}
          >
            ELECTRONICS
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-mono font-bold tracking-wider text-cyan-400 uppercase ${currentSize.textSub} flex items-center gap-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`}
          >
            <span>OFFICIAL TECH STORE &amp; LAB</span>
          </span>
        )}
      </div>
    </div>
  );
};

export const LogoWatermark: React.FC<{
  className?: string;
  text?: string;
  subtext?: string;
  customLogoUrl?: string;
}> = ({
  className = '',
  text = 'FAREED ELECTRONICS',
  subtext = 'OFFICIAL TECH STORE & CHIP-LEVEL LAB',
  customLogoUrl,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none flex flex-col items-center justify-center text-center ${className}`}
    >
      {customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt=""
          className="w-48 h-48 object-contain opacity-50 grayscale"
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="w-40 h-40 opacity-70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Outline */}
          <path
            d="M50 8 L84 22 L84 56 C84 76 68 89 50 94 C32 89 16 76 16 56 L16 22 Z"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Inner Shield */}
          <path
            d="M50 15 L78 27 L78 54 C78 70 65 82 50 86 C35 82 22 70 22 54 L22 27 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            fill="none"
          />
          {/* Central Stylized F & Lightning Bolt */}
          <path
            d="M38 32 H62 V42 H46 V49 H58 V57 H46 V72 H38 Z"
            fill="currentColor"
          />
          <path
            d="M56 36 L48 52 H58 L46 72 L50 56 H42 Z"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
      )}

      <div className="mt-2 font-black tracking-widest text-base uppercase text-current">
        {text}
      </div>
      <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-current mt-0.5">
        {subtext}
      </div>
    </div>
  );
};
