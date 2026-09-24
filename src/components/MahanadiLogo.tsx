import React from 'react';

interface MahanadiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'card';
  fullCard?: boolean;
}

export const MahanadiLogo: React.FC<MahanadiLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'light',
  fullCard = false,
}) => {
  const sizeDimensions = {
    sm: { box: 36, textClass: 'text-xs', subtextClass: 'text-[9px]' },
    md: { box: 48, textClass: 'text-sm', subtextClass: 'text-[10px]' },
    lg: { box: 72, textClass: 'text-lg', subtextClass: 'text-xs' },
    xl: { box: 96, textClass: 'text-xl', subtextClass: 'text-xs' },
    '2xl': { box: 140, textClass: 'text-2xl', subtextClass: 'text-sm' },
  };

  const dim = sizeDimensions[size];

  // The authentic Mahanadi House Emblem SVG based directly on the house crest:
  // Rising golden-yellow sun with 9 radiating flame tips and a central spiral wave cutout,
  // over the open book & flowing river wave motif in vivid royal azure blue.
  const LogoSVG = ({ includeTextInSvg = false }: { includeTextInSvg?: boolean }) => (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-md transition-transform duration-300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Golden Sun Gradient */}
        <linearGradient id="sunGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE135" />
          <stop offset="40%" stopColor="#FFD200" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* River Book Vivid Blue Gradient */}
        <linearGradient id="bookBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0077D4" />
          <stop offset="100%" stopColor="#005CB2" />
        </linearGradient>

        {/* Spiral Cutout Mask: Punches transparent groove through the sun */}
        <mask id="sunSpiralMask">
          {/* White = keep */}
          <rect x="0" y="0" width="200" height="200" fill="#FFFFFF" />
          
          {/* Black = cut out completely so background shows through */}
          <path
            d="
              M 103,99
              C 84,97 68,85 67,70
              C 66,54 81,42 99,41
              C 118,40 133,52 133,69
              C 133,83 121,93 106,93
              C 94,93 85,85 85,73
              C 85,63 93,56 102,56
              C 110,56 116,62 116,69
              C 116,74 112,78 107,78
              C 104,78 101,75 101,71
            "
            fill="none"
            stroke="#000000"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>

        {/* Soft shadow for depth */}
        <filter id="crestGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#B45309" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* --- 1. THE RISING SUN WITH 9 RAYS & SPIRAL CORE --- */}
      <g filter="url(#crestGlow)" mask="url(#sunSpiralMask)">
        {/* The 9 rays fanning in a proud semicircular crown */}
        <path
          d="
            M 36,96
            C 36,94 40,84 45,82
            L 40,70
            C 46,71 52,72 55,70
            L 53,49
            C 61,54 67,59 71,59
            L 75,34
            C 83,43 88,50 91,52
            L 100,28
            L 109,52
            C 112,50 117,43 125,34
            L 129,59
            C 133,59 139,54 147,49
            L 145,70
            C 148,72 154,71 160,70
            L 155,82
            C 160,84 164,94 164,96
            L 153,99
            C 148,73 126,55 100,55
            C 74,55 52,73 47,99
            Z
          "
          fill="url(#sunGoldGrad)"
        />

        {/* Sun Semicircular Solid Disk Base */}
        <path
          d="M 44,98 C 44,67 69,42 100,42 C 131,42 156,67 156,98 Z"
          fill="url(#sunGoldGrad)"
        />
      </g>

      {/* --- 2. THE OPEN BOOK / FLOWING RIVER WAVES IN VIVID BLUE --- */}
      <g>
        {/* Top Edge Double Trim / Page Lining (Left Wing) */}
        <path
          d="
            M 97,97
            C 75,90 50,91 26,95
            C 25,95 24,96 24,98
            C 24,100 25,101 26,101
            C 50,97 74,96 96,102
            Z
          "
          fill="#0284C7"
          fillOpacity="0.95"
        />

        {/* Top Edge Double Trim / Page Lining (Right Wing) */}
        <path
          d="
            M 103,97
            C 125,90 150,91 174,95
            C 175,95 176,96 176,98
            C 176,100 175,101 174,101
            C 150,97 126,96 104,102
            Z
          "
          fill="#0284C7"
          fillOpacity="0.95"
        />

        {/* Main Open Book / River Wave Body */}
        <path
          d="
            M 100,103
            C 77,95 50,96 24,101
            L 24,117
            C 48,112 75,112 100,132
            C 125,112 152,112 176,117
            L 176,101
            C 150,96 123,95 100,103
            Z
          "
          fill="url(#bookBlueGrad)"
          stroke="#0284C7"
          strokeWidth="0.8"
        />

        {/* Subtle Page Ridge Wave Accent */}
        <path
          d="
            M 100,103
            C 65,95 40,98 25,103
            L 25,106
            C 40,101 65,98 100,106
            C 135,98 160,101 175,106
            L 175,103
            C 160,98 135,95 100,103
            Z
          "
          fill="#38BDF8"
          fillOpacity="0.4"
        />

        {/* Central Spine Notch Line */}
        <path
          d="M 100,104 L 100,132"
          stroke="#004A94"
          strokeWidth="1.2"
        />
      </g>

      {/* --- 3. INTEGRATED TYPOGRAPHY IN SVG (Used in Full Card poster) --- */}
      {includeTextInSvg && (
        <g>
          {/* MAHANADI in Bright Golden Yellow */}
          <text
            x="100"
            y="162"
            textAnchor="middle"
            fill="#FFD200"
            fontSize="21"
            fontWeight="900"
            letterSpacing="2.5"
            style={{ fontFamily: 'var(--font-crest), system-ui, sans-serif' }}
          >
            MAHANADI
          </text>

          {/* PRIDE BY MY SIDE in Crisp White */}
          <text
            x="100"
            y="178"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="3"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            PRIDE BY MY SIDE
          </text>
        </g>
      )}
    </svg>
  );

  // If fullCard presentation is requested (matching the official logo poster with sunset gradient)
  if (fullCard) {
    return (
      <div className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-800 text-white flex flex-col items-center justify-center text-center ${className}`}>
        {/* Ambient background radial lights */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-900/40 rounded-full blur-2xl" />

        <div className="relative w-44 h-44 mb-1">
          <LogoSVG includeTextInSvg={true} />
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex-shrink-0"
        style={{ width: dim.box, height: dim.box }}
      >
        <LogoSVG includeTextInSvg={false} />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span 
              className={`font-black tracking-wider ${dim.textClass} leading-tight ${
                variant === 'dark' ? 'text-amber-400' : 'text-slate-900 dark:text-amber-400'
              }`}
              style={{ fontFamily: "var(--font-crest), sans-serif" }}
            >
              MAHANADI
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 uppercase tracking-widest">
              House
            </span>
          </div>
          <span 
            className={`font-bold uppercase tracking-widest ${dim.subtextClass} ${
              variant === 'dark' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            PRIDE BY MY SIDE
          </span>
        </div>
      )}
    </div>
  );
};
