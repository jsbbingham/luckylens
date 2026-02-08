import { useEffect, useState, useCallback } from 'react';
import { LotteryGame } from '@/types';

interface BallSet {
  mainBalls: number[];
  bonusBall: number;
}

interface BallRevealAnimationProps {
  sets: BallSet[];
  game: LotteryGame;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

// Check for reduced motion preference
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

export function BallRevealAnimation({
  sets,
  game,
  isAnimating,
  onAnimationComplete,
}: BallRevealAnimationProps) {
  const reducedMotion = useReducedMotion();
  const [revealedBalls, setRevealedBalls] = useState<Set<string>>(new Set());
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sparkles, setSparkles] = useState<Map<string, Sparkle[]>>(new Map());
  const [isComplete, setIsComplete] = useState(false);

  const generateSparkles = useCallback((ballKey: string): Sparkle[] => {
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < 4; i++) {
      newSparkles.push({
        id: i,
        x: (Math.random() - 0.5) * 60, // -30 to 30
        y: (Math.random() - 0.5) * 60, // -30 to 30
      });
    }
    return newSparkles;
  }, []);

  useEffect(() => {
    if (!isAnimating || sets.length === 0) return;

    // If reduced motion, show everything instantly
    if (reducedMotion) {
      const allBalls = new Set<string>();
      sets.forEach((set, setIdx) => {
        set.mainBalls.forEach((_, ballIdx) => {
          allBalls.add(`${setIdx}-main-${ballIdx}`);
        });
        allBalls.add(`${setIdx}-bonus`);
      });
      setRevealedBalls(allBalls);
      setIsComplete(true);
      onAnimationComplete();
      return;
    }

    // Animation sequence
    let timeouts: NodeJS.Timeout[] = [];
    let ballDelay = 0;

    sets.forEach((set, setIndex) => {
      // Reveal main balls one by one
      set.mainBalls.forEach((_, ballIndex) => {
        const ballKey = `${setIndex}-main-${ballIndex}`;
        
        timeouts.push(
          setTimeout(() => {
            setRevealedBalls(prev => new Set([...prev, ballKey]));
            
            // Add sparkles
            const ballSparkles = generateSparkles(ballKey);
            setSparkles(prev => new Map([...prev, [ballKey, ballSparkles]]));
            
            // Remove sparkles after animation
            setTimeout(() => {
              setSparkles(prev => {
                const next = new Map(prev);
                next.delete(ballKey);
                return next;
              });
            }, 600);
          }, ballDelay)
        );
        
        ballDelay += 350;
      });

      // Reveal bonus ball after main balls
      const bonusKey = `${setIndex}-bonus`;
      timeouts.push(
        setTimeout(() => {
          setRevealedBalls(prev => new Set([...prev, bonusKey]));
          setCurrentSetIndex(setIndex);
          
          // Add sparkles for bonus
          const ballSparkles = generateSparkles(bonusKey);
          setSparkles(prev => new Map([...prev, [bonusKey, ballSparkles]]));
          
          setTimeout(() => {
            setSparkles(prev => {
              const next = new Map(prev);
              next.delete(bonusKey);
              return next;
            });
          }, 600);
        }, ballDelay)
      );

      ballDelay += 600; // Delay between sets
    });

    // Animation complete
    timeouts.push(
      setTimeout(() => {
        setIsComplete(true);
        onAnimationComplete();
      }, ballDelay)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isAnimating, sets, reducedMotion, onAnimationComplete, generateSparkles]);

  const getBallColorClass = (isBonus: boolean): string => {
    if (isBonus) {
      return game.secondaryCount > 1 ? 'bg-lucky-ball-red' : 'bg-lucky-ball-red';
    }
    return 'bg-lucky-primary';
  };

  return (
    <div className="space-y-8">
      {sets.map((set, setIndex) => (
        <div key={setIndex} className="space-y-3">
          {sets.length > 1 && (
            <h3 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text">
              Set {setIndex + 1}
            </h3>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Main balls */}
            {set.mainBalls.map((ball, ballIndex) => {
              const ballKey = `${setIndex}-main-${ballIndex}`;
              const isRevealed = revealedBalls.has(ballKey);
              const ballSparkles = sparkles.get(ballKey) || [];

              return (
                <div key={ballIndex} className="relative">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      text-white font-bold text-lg shadow-lg
                      transition-all duration-300
                      ${isRevealed 
                        ? `${getBallColorClass(false)} animate-ball-bounce` 
                        : 'bg-gray-300 dark:bg-gray-600 opacity-50'
                      }
                    `}
                    style={{
                      animationDelay: isRevealed ? '0ms' : undefined,
                    }}
                  >
                    {isRevealed ? ball : ''}
                  </div>
                  
                  {/* Sparkles */}
                  {ballSparkles.map((sparkle) => (
                    <div
                      key={sparkle.id}
                      className="absolute w-2 h-2 rounded-full bg-lucky-gold animate-sparkle-fly pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        '--sparkle-x': `${sparkle.x}px`,
                        '--sparkle-y': `${sparkle.y}px`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              );
            })}

            {/* Divider */}
            <div className="w-4" />

            {/* Bonus ball(s) */}
            <div className="relative">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  text-white font-bold text-lg shadow-lg
                  transition-all duration-300
                  ${revealedBalls.has(`${setIndex}-bonus`)
                    ? `${getBallColorClass(true)} animate-ball-bounce` 
                    : 'bg-gray-300 dark:bg-gray-600 opacity-50'
                  }
                `}
              >
                {revealedBalls.has(`${setIndex}-bonus`) ? set.bonusBall : ''}
              </div>
              
              {/* Sparkles for bonus */}
              {(sparkles.get(`${setIndex}-bonus`) || []).map((sparkle) => (
                <div
                  key={sparkle.id}
                  className="absolute w-2 h-2 rounded-full bg-lucky-gold animate-sparkle-fly pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    '--sparkle-x': `${sparkle.x}px`,
                    '--sparkle-y': `${sparkle.y}px`,
                  } as React.CSSProperties}
                />
              ))}
            </div>

            {/* Bonus label */}
            {revealedBalls.has(`${setIndex}-bonus`) && (
              <span className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted ml-1">
                {game.secondaryCount > 1 ? 'PB' : 'Bonus'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
