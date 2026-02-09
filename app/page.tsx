'use client';

import { useState, useEffect } from 'react';
import { Dices, Hand, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { LogoHero } from '@/components/LogoHero';
import { Disclaimer } from '@/components/Disclaimer';
import { GameSelector } from '@/components/GameSelector';
import { ActionCard } from '@/components/ActionCard';
import { QuickStat } from '@/components/QuickStat';
import { getDefaultGame, getGameById } from '@/lib/games';
import { useHistory } from '@/hooks/useHistory';
import { useDBAvailable } from '@/hooks/useDBAvailable';
import { LotteryGame, HistoricalDraw } from '@/types';
import { formatRelativeTime, formatDate, formatDateTimeWithTimezone } from '@/lib/utils';
import { db } from '@/lib/db';

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState<LotteryGame>(getDefaultGame());
  const [lastDrawDate, setLastDrawDate] = useState<Date | null>(null);
  const [isLoadingLastDraw, setIsLoadingLastDraw] = useState(true);
  
  const { useTotalGeneratedCount } = useHistory();
  const totalGenerated = useTotalGeneratedCount();
  const { isAvailable: isDBAvailable, isChecking: isCheckingDB } = useDBAvailable();
  
  const nextDraw = selectedGame.nextDrawDate();

  // Fetch last draw date for selected game
  useEffect(() => {
    async function fetchLastDraw() {
      if (!isDBAvailable) {
        setIsLoadingLastDraw(false);
        return;
      }

      setIsLoadingLastDraw(true);
      try {
        const draws = await db.historicalDraws
          .where('gameId')
          .equals(selectedGame.id)
          .reverse()
          .sortBy('date');
        
        if (draws.length > 0) {
          setLastDrawDate(new Date(draws[0].date));
        } else {
          setLastDrawDate(null);
        }
      } catch (error) {
        console.error('Failed to fetch last draw:', error);
        setLastDrawDate(null);
      } finally {
        setIsLoadingLastDraw(false);
      }
    }

    fetchLastDraw();
  }, [selectedGame.id, isDBAvailable]);

  const handleGameChange = (game: LotteryGame) => {
    setSelectedGame(game);
    setLastDrawDate(null); // Reset while loading
  };

  // Get display values for stats
  const setsGeneratedDisplay = isCheckingDB ? '—' : totalGenerated.toString();
  const lastDrawDisplay = isLoadingLastDraw 
    ? '—' 
    : lastDrawDate 
      ? formatDate(lastDrawDate) 
      : '—';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* DB Unavailable Warning */}
      {!isCheckingDB && !isDBAvailable && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Local storage is unavailable. Your data won&apos;t be saved between sessions.</span>
        </div>
      )}

      {/* Title Section */}
      <div className="flex justify-center py-6">
        <LogoHero size={80} showText={true} />
      </div>

      {/* Disclaimer */}
      <Disclaimer variant="full" />

      {/* Game Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
          Select Lottery Game
        </label>
        <GameSelector 
          selectedGame={selectedGame}
          onSelectGame={handleGameChange}
        />
      </div>

      {/* Quick Stats Bar */}
      <div className="flex flex-wrap gap-3">
        <QuickStat 
          label="Sets Generated" 
          value={setsGeneratedDisplay}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <QuickStat 
          label="Last Draw" 
          value={lastDrawDisplay}
          icon={<Calendar className="w-4 h-4" />}
        />
        <QuickStat
          label="Next Draw"
          value={`${formatRelativeTime(nextDraw)} (${formatDateTimeWithTimezone(nextDraw)})`}
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text">
          What would you like to do?
        </h2>
        
        <div className="grid gap-4">
          <ActionCard
            title="Random Numbers"
            description="Generate truly random number combinations for your selected lottery game."
            icon={Dices}
            href="/generate?mode=random"
            color="primary"
          />
          
          <ActionCard
            title="Trend-Based"
            description="Use frequency analysis and hot/cold numbers to guide your selection."
            icon={TrendingUp}
            href="/generate?mode=trend"
            color="secondary"
          />
          
          <ActionCard
            title="Pick Your Own"
            description="Manually select your lucky numbers and save them for future reference."
            icon={Hand}
            href="/self-pick"
            color="accent"
          />
        </div>
      </div>

      {/* Selected Game Info */}
      <div className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-4 border border-lucky-border dark:border-lucky-dark-border">
        <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text mb-2">
          About {selectedGame.name}
        </h3>
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted mb-3">
          {selectedGame.description}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-lucky-primary/10 dark:bg-lucky-primary/20 text-lucky-primary dark:text-lucky-primary rounded-full">
            {selectedGame.primaryCount}/{selectedGame.primaryMax} + {selectedGame.secondaryCount}/{selectedGame.secondaryMax}
          </span>
          <span className="px-2 py-1 bg-lucky-surface-hover dark:bg-lucky-dark-surface-hover text-lucky-text dark:text-lucky-dark-text rounded-full">
            Draws: {selectedGame.drawDays.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
