'use client';

import { useState, useCallback } from 'react';
import { Hand, Save, Trash2, Check } from 'lucide-react';
import { NumberGrid } from '@/components/NumberGrid';
import { GameSelector } from '@/components/GameSelector';
import { Disclaimer } from '@/components/Disclaimer';
import { useToast } from '@/hooks/useToast';
import { useHistory } from '@/hooks/useHistory';
import { getDefaultGame } from '@/lib/games';
import { LotteryGame } from '@/types';
import { generateUniqueId } from '@/lib/utils';

export default function SelfPickPage() {
  const [selectedGame, setSelectedGame] = useState<LotteryGame>(getDefaultGame());
  const [mainNumbers, setMainNumbers] = useState<number[]>([]);
  const [bonusNumbers, setBonusNumbers] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);

  const { showToast } = useToast();
  const { saveSets } = useHistory();

  // Handle main number toggle
  const handleMainToggle = useCallback((num: number) => {
    setMainNumbers(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      if (prev.length < selectedGame.primaryCount) {
        return [...prev, num].sort((a, b) => a - b);
      }
      return prev;
    });
  }, [selectedGame.primaryCount]);

  // Handle bonus number toggle
  const handleBonusToggle = useCallback((num: number) => {
    setBonusNumbers(prev => {
      if (prev.includes(num)) {
        return [];
      }
      return [num];
    });
  }, []);

  // Check if save is enabled
  const canSave = mainNumbers.length === selectedGame.primaryCount && 
                  bonusNumbers.length === selectedGame.secondaryCount;

  // Handle save
  const handleSave = useCallback(async () => {
    if (!canSave) return;

    // Validate all numbers are in valid ranges
    const validMainNumbers = mainNumbers.every(
      n => n >= 1 && n <= selectedGame.primaryMax
    );
    const validBonusNumber = bonusNumbers.every(
      n => n >= 1 && n <= selectedGame.secondaryMax
    );

    if (!validMainNumbers || !validBonusNumber) {
      showToast('Invalid number selection', 'error');
      return;
    }

    // Check for duplicates (shouldn't happen via UI, but validate)
    const uniqueMainNumbers = [...new Set(mainNumbers)];
    if (uniqueMainNumbers.length !== mainNumbers.length) {
      showToast('Duplicate numbers detected', 'error');
      return;
    }

    // Save to Dexie
    const batchId = generateUniqueId();
    await saveSets([{
      timestamp: new Date(),
      gameId: selectedGame.id,
      primaryNumbers: mainNumbers,
      secondaryNumbers: bonusNumbers,
      generationType: 'manual',
      saved: true,
      notes: '',
      batchId,
    }]);

    setSaved(true);
    showToast('Your numbers have been saved! 🎉', 'success');
  }, [canSave, mainNumbers, bonusNumbers, selectedGame, saveSets, showToast]);

  // Handle clear all
  const handleClear = useCallback(() => {
    setMainNumbers([]);
    setBonusNumbers([]);
    setSaved(false);
  }, []);

  // Handle pick another
  const handlePickAnother = useCallback(() => {
    setMainNumbers([]);
    setBonusNumbers([]);
    setSaved(false);
  }, []);

  // Handle game change - reset selections
  const handleGameChange = useCallback((game: LotteryGame) => {
    setSelectedGame(game);
    setMainNumbers([]);
    setBonusNumbers([]);
    setSaved(false);
  }, []);

  // Get ball colors based on game
  const getMainBallColor = () => {
    return 'bg-lucky-primary';
  };

  const getBonusBallColor = () => {
    return 'bg-lucky-ball-red';
  };

  if (saved) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-lucky-success/10 dark:bg-lucky-success/20 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-lucky-success" />
          </div>
          <h2 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text mb-2">
            Saved Successfully!
          </h2>
          <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted mb-6">
            Your {selectedGame.name} numbers have been saved to your history.
          </p>
          
          {/* Preview saved numbers */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {mainNumbers.map((num, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-lucky-primary text-white font-bold flex items-center justify-center"
              >
                {num}
              </div>
            ))}
            <div className="w-2" />
            <div className="w-12 h-12 rounded-full bg-lucky-ball-red text-white font-bold flex items-center justify-center">
              {bonusNumbers[0]}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePickAnother}
              className="px-6 py-3 rounded-xl font-medium text-white bg-lucky-primary hover:bg-lucky-primary-hover transition-colors"
            >
              Pick Another Set
            </button>
            <a
              href="/history"
              className="px-6 py-3 rounded-xl font-medium text-lucky-text dark:text-lucky-dark-text bg-lucky-surface dark:bg-lucky-dark-surface border-2 border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors"
            >
              Go to History
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Hand className="w-6 h-6 text-lucky-accent" />
          <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
            Self-Pick
          </h1>
        </div>
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
          Pick {selectedGame.primaryCount} numbers from 1–{selectedGame.primaryMax} and {selectedGame.secondaryCount} {selectedGame.secondaryCount > 1 ? 'bonus numbers' : 'bonus number'} from 1–{selectedGame.secondaryMax}
        </p>
      </div>

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

      {/* Preview Section */}
      <div className="p-4 bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl border border-lucky-border dark:border-lucky-dark-border">
        <p className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text mb-3">
          Your Selection
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main numbers */}
          {Array.from({ length: selectedGame.primaryCount }).map((_, i) => {
            const num = mainNumbers[i];
            return (
              <div
                key={`main-${i}`}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${num 
                    ? 'bg-lucky-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-600'
                  }
                `}
              >
                {num || ''}
              </div>
            );
          })}
          
          {/* Divider */}
          <div className="w-4" />
          
          {/* Bonus number(s) */}
          {Array.from({ length: selectedGame.secondaryCount }).map((_, i) => {
            const num = bonusNumbers[i];
            return (
              <div
                key={`bonus-${i}`}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${num 
                    ? 'bg-lucky-ball-red text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-600'
                  }
                `}
              >
                {num || ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Numbers Grid */}
      <div className="space-y-4">
        <NumberGrid
          min={1}
          max={selectedGame.primaryMax}
          maxSelections={selectedGame.primaryCount}
          selectedNumbers={mainNumbers}
          onToggle={handleMainToggle}
          ballColor={getMainBallColor()}
          label="Choose your main numbers"
        />
      </div>

      {/* Bonus Numbers Grid */}
      <div className="space-y-4">
        <NumberGrid
          min={1}
          max={selectedGame.secondaryMax}
          maxSelections={selectedGame.secondaryCount}
          selectedNumbers={bonusNumbers}
          onToggle={handleBonusToggle}
          ballColor={getBonusBallColor()}
          label={`Choose your ${selectedGame.secondaryCount > 1 ? 'bonus numbers' : 'bonus number'}`}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`
            flex-1 py-4 rounded-xl font-semibold text-white text-lg
            transition-all duration-200
            flex items-center justify-center gap-2
            ${canSave
              ? 'bg-gradient-to-r from-lucky-accent to-lucky-gold hover:from-lucky-accent-hover hover:to-lucky-gold-hover'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-60'
            }
          `}
        >
          <Save className="w-5 h-5" />
          Save to History
        </button>
        
        <button
          onClick={handleClear}
          className="px-6 py-4 rounded-xl font-medium text-lucky-text dark:text-lucky-dark-text bg-lucky-surface dark:bg-lucky-dark-surface border-2 border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Clear
        </button>
      </div>

      {/* Disclaimer */}
      <Disclaimer variant="compact" />
    </div>
  );
}
