interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * LuckyLens Logo Component
 * A stylized magnifying glass with lottery balls visible through the lens
 */
export function Logo({ size = 48, className = '', animated = true }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="LuckyLens Logo"
    >
      <title>LuckyLens Logo</title>
      
      <defs>
        {/* Primary gradient - blue to green */}
        <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#00CC88" />
        </linearGradient>
        
        {/* Ball gradients */}
        <radialGradient id="ballRed" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#EE5A5A" />
        </radialGradient>
        
        <radialGradient id="ballBlue" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4ECDC4" />
          <stop offset="100%" stopColor="#3DBBB4" />
        </radialGradient>
        
        <radialGradient id="ballGold" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE66D" />
          <stop offset="100%" stopColor="#FFD93D" />
        </radialGradient>
        
        {/* Sparkle gradient */}
        <radialGradient id="sparkleGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        
        {/* Drop shadow filter */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* Handle */}
      <rect
        x="58"
        y="58"
        width="32"
        height="10"
        rx="5"
        fill="url(#lensGradient)"
        transform="rotate(45 74 63)"
        filter="url(#shadow)"
      />
      
      {/* Lens outer ring */}
      <circle
        cx="42"
        cy="42"
        r="32"
        fill="none"
        stroke="url(#lensGradient)"
        strokeWidth="6"
        filter="url(#shadow)"
      />
      
      {/* Lens inner highlight */}
      <circle
        cx="42"
        cy="42"
        r="28"
        fill="rgba(255, 255, 255, 0.1)"
        stroke="none"
      />
      
      {/* Lottery ball - Blue with "7" */}
      <circle cx="32" cy="38" r="9" fill="url(#ballBlue)" filter="url(#shadow)" />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        7
      </text>
      
      {/* Lottery ball - Red with "21" */}
      <circle cx="50" cy="32" r="10" fill="url(#ballRed)" filter="url(#shadow)" />
      <text
        x="50"
        y="36"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        21
      </text>
      
      {/* Lottery ball - Gold with "42" */}
      <circle cx="46" cy="52" r="8" fill="url(#ballGold)" filter="url(#shadow)" />
      <text
        x="46"
        y="55"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#333"
        fontFamily="system-ui, sans-serif"
      >
        42
      </text>
      
      {/* Sparkle/star accent */}
      <g
        className={animated ? 'animate-sparkle' : ''}
        style={{
          transformOrigin: '68px 22px',
        }}
      >
        {/* Four-pointed star */}
        <path
          d="M68 14 L70 20 L76 22 L70 24 L68 30 L66 24 L60 22 L66 20 Z"
          fill="url(#sparkleGradient)"
        />
        {/* Additional sparkle dots */}
        <circle cx="74" cy="18" r="1.5" fill="#FFD700" opacity="0.8" />
        <circle cx="62" cy="26" r="1" fill="#FFD700" opacity="0.6" />
      </g>
      
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.6; transform: scale(0.9) rotate(180deg); }
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-sparkle {
            animation: none;
          }
        }
      `}</style>
    </svg>
  );
}
