import { Logo } from './Logo';

interface LogoHeroProps {
  size?: number;
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

/**
 * LuckyLens Logo Hero Component
 * Larger logo variant for splash screens and hero sections
 * Includes the LuckyLens text alongside the logo
 */
export function LogoHero({ 
  size = 120, 
  showText = true, 
  className = '', 
  animated = true 
}: LogoHeroProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Logo size={size} animated={animated} />
      
      {showText && (
        <div className="flex flex-col">
          <span 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lucky-primary to-lucky-secondary bg-clip-text text-transparent"
            style={{ lineHeight: 1.1 }}
          >
            LuckyLens
          </span>
          <span className="text-sm md:text-base text-lucky-text-muted dark:text-lucky-dark-text-muted mt-1">
            Your Fun Lottery Companion
          </span>
        </div>
      )}
    </div>
  );
}
