'use client';

import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { LOTTERY_GAMES } from '@/lib/games';
import { LotteryGame } from '@/types';

interface GameSelectorProps {
  selectedGame: LotteryGame;
  onSelectGame: (game: LotteryGame) => void;
}

export function GameSelector({ selectedGame, onSelectGame }: GameSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-3 p-4 rounded-xl
          bg-lucky-surface dark:bg-lucky-dark-surface
          border-2 border-lucky-border dark:border-lucky-dark-border
          hover:border-lucky-primary dark:hover:border-lucky-primary
          transition-all duration-200
          ${isOpen ? 'border-lucky-primary dark:border-lucky-primary' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${selectedGame.primaryColor} text-white font-bold text-sm
          `}>
            {selectedGame.name.charAt(0)}
          </div>
          <div className="text-left">
            <p className="font-semibold text-lucky-text dark:text-lucky-dark-text">
              {selectedGame.name}
            </p>
            <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {selectedGame.region}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-lucky-text-muted dark:text-lucky-dark-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-lucky-surface dark:bg-lucky-dark-surface-elevated rounded-xl border border-lucky-border dark:border-lucky-dark-border shadow-lg overflow-hidden">
          {LOTTERY_GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                onSelectGame(game);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 p-3
                hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover
                transition-colors duration-150
                ${game.id === selectedGame.id ? 'bg-lucky-primary/10 dark:bg-lucky-primary/20' : ''}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${game.primaryColor} text-white font-bold text-xs
              `}>
                {game.name.charAt(0)}
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-sm text-lucky-text dark:text-lucky-dark-text">
                  {game.name}
                </p>
                <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
                  {game.region} • {game.primaryCount}/{game.primaryMax} + {game.secondaryCount}/{game.secondaryMax}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
