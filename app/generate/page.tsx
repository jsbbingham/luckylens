'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Dices, TrendingUp, Loader2, Save, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { GameSelector } from '@/components/GameSelector';
import { SetCountSelector } from '@/components/SetCountSelector';
import { BallRevealAnimation } from '@/components/BallRevealAnimation';
import { Disclaimer } from '@/components/Disclaimer';
import { useToast } from '@/hooks/useToast';
import { getGameById, getDefaultGame } from '@/lib/games';
import { generateMultipleSets } from '@/lib/random';
import { generateMultipleTrendSets } from '@/lib/weighted';
import { useHistory } from '@/hooks/useHistory';
import { useDrawResults } from '@/hooks/useDrawResults';
import { useSettings } from '@/hooks/useSettings';
import { LotteryGame } from '@/types';
import { generateUniqueId } from '@/lib/utils';

interface GeneratedSet {
  mainBalls: number[];
  bonusBall: number;
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-lucky-primary" /></div>}>
      <GeneratePageContent />
    </Suspense>
  );
}

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'random' | 'trend' | null;
  const isTrendMode = mode === 'trend';

  const [selectedGame, setSelectedGame] = useState<LotteryGame>(getDefaultGame());
  const [setCount, setSetCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSets, setGeneratedSets] = useState<GeneratedSet[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [savedSetIndices, setSavedSetIndices] = useState<Set<number>>(new Set());
  const [showNoDataWarning, setShowNoDataWarning] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { settings, updateSettings } = useSettings();
  const { saveSets, getLastSavedSet } = useHistory();
  const { getFrequencies, hasDrawResults } = useDrawResults();
  const { showToast } = useToast();

  // Load default set count from settings
  useEffect(() => {
    if (settings?.defaultSetCount) {
      setSetCount(settings.defaultSetCount);
    }
  }, [settings]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedSets([]);
    setSavedSetIndices(new Set());
    setAnimationComplete(false);
    setShowNoDataWarning(false);

    let sets: GeneratedSet[] = [];

    if (isTrendMode) {
      // Check if we have draw data
      const hasData = await hasDrawResults(selectedGame.id);
      
      if (!hasData) {
        setShowNoDataWarning(true);
        // Fall back to random
        const lastSet = settings?.noRepeat ? await getLastSavedSet(selectedGame.id) : null;
        sets = generateMultipleSets(selectedGame, setCount, settings?.noRepeat ?? false, lastSet);
      } else {
        // Get frequencies and generate trend-based sets
        const { main, bonus } = await getFrequencies(selectedGame.id);
        const lastSet = settings?.noRepeat ? await getLastSavedSet(selectedGame.id) : null;
        sets = generateMultipleTrendSets(
          selectedGame,
          main,
          bonus,
          setCount,
          settings?.noRepeat ?? false,
          lastSet
        );
      }
    } else {
      // Random mode
      const lastSet = settings?.noRepeat ? await getLastSavedSet(selectedGame.id) : null;
      sets = generateMultipleSets(selectedGame, setCount, settings?.noRepeat ?? false, lastSet);
    }

    setGeneratedSets(sets);
    setIsGenerating(false);
    setIsAnimating(true);
  }, [isTrendMode, selectedGame, setCount, settings, getLastSavedSet, getFrequencies, hasDrawResults]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    setAnimationComplete(true);
  }, []);

  const handleSaveSet = useCallback(async (setIndex: number) => {
    const set = generatedSets[setIndex];
    if (!set) return;

    const batchId = generateUniqueId();
    
    await saveSets([{
      timestamp: new Date(),
      gameId: selectedGame.id,
      primaryNumbers: set.mainBalls,
      secondaryNumbers: [set.bonusBall],
      generationType: (isTrendMode ? 'trend' : 'random') as 'trend' | 'random',
      saved: true,
      notes: '',
      batchId,
    }]);

    setSavedSetIndices(prev => {
      const newSet = new Set(prev);
      newSet.add(setIndex);
      return newSet;
    });
    showToast('Saved!', 'success');
  }, [generatedSets, selectedGame.id, isTrendMode, saveSets, showToast]);

  const handleSaveAll = useCallback(async () => {
    const batchId = generateUniqueId();

    const setsToSave = generatedSets.map(set => ({
      timestamp: new Date(),
      gameId: selectedGame.id,
      primaryNumbers: set.mainBalls,
      secondaryNumbers: [set.bonusBall],
      generationType: (isTrendMode ? 'trend' : 'random') as 'trend' | 'random',
      saved: true,
      notes: '',
      batchId,
    }));

    await saveSets(setsToSave);

    // Mark all as saved
    const allIndices = new Set(generatedSets.map((_, i) => i));
    setSavedSetIndices(allIndices);
    showToast(`All ${generatedSets.length} sets saved!`, 'success');
  }, [generatedSets, selectedGame.id, isTrendMode, saveSets, showToast]);

  const handleGenerateAgain = useCallback(() => {
    setGeneratedSets([]);
    setSavedSetIndices(new Set());
    setAnimationComplete(false);
    setShowNoDataWarning(false);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          {isTrendMode ? (
            <TrendingUp className="w-6 h-6 text-lucky-secondary" />
          ) : (
            <Dices className="w-6 h-6 text-lucky-primary" />
          )}
          <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
            {isTrendMode ? '📊 Trend-Based Generation' : '🎰 Random Generation'}
          </h1>
        </div>
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
          {isTrendMode 
            ? 'Generate numbers based on historical frequency analysis'
            : 'Generate truly random numbers with cryptographically secure algorithm'
          }
        </p>
      </div>

      {/* Game Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
          Select Lottery Game
        </label>
        <GameSelector 
          selectedGame={selectedGame}
          onSelectGame={setSelectedGame}
        />
      </div>

      {/* No Data Warning */}
      {showNoDataWarning && (
        <div className="flex items-start gap-3 p-4 bg-lucky-accent/10 dark:bg-lucky-accent/20 border border-lucky-accent/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-lucky-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-lucky-text dark:text-lucky-dark-text">
            <strong>No trend data available.</strong> Showing random numbers instead. 
            Sync past results in the <Link href="/results" className="text-lucky-primary underline">Results tab</Link> to enable trend-based generation.
          </p>
        </div>
      )}

      {/* Set Count Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
          Number of Sets to Generate
        </label>
        <SetCountSelector value={setCount} onChange={setSetCount} />
      </div>

      {/* Generate Button */}
      {generatedSets.length === 0 && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`
            w-full py-4 rounded-xl font-semibold text-white text-lg
            transition-all duration-200
            ${isTrendMode 
              ? 'bg-gradient-to-r from-lucky-secondary to-lucky-primary hover:from-lucky-secondary hover:to-lucky-primary' 
              : 'bg-gradient-to-r from-lucky-primary to-lucky-secondary hover:from-lucky-primary-hover hover:to-lucky-secondary'
            }
            ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'animate-pulse-glow hover:scale-[1.02]'}
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </span>
          ) : (
            'Generate Numbers'
          )}
        </button>
      )}

      {/* Results Area */}
      {generatedSets.length > 0 && (
        <div className="space-y-6">
          {/* Animation */}
          <BallRevealAnimation
            sets={generatedSets}
            game={selectedGame}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
          />

          {/* Action Buttons */}
          {animationComplete && (
            <div className="space-y-4 animate-fade-in">
              {/* Individual Set Cards */}
              <div className="space-y-3">
                {generatedSets.map((set, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl border border-lucky-border dark:border-lucky-dark-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lucky-text dark:text-lucky-dark-text">
                          Set {index + 1}
                        </span>
                        {isTrendMode && (
                          <span className="px-2 py-0.5 text-xs bg-lucky-secondary/10 dark:bg-lucky-secondary/20 text-lucky-secondary rounded-full">
                            Trend
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleSaveSet(index)}
                        disabled={savedSetIndices.has(index)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                          transition-colors
                          ${savedSetIndices.has(index)
                            ? 'bg-lucky-success/10 text-lucky-success cursor-default'
                            : 'bg-lucky-primary text-white hover:bg-lucky-primary-hover'
                          }
                        `}
                      >
                        {savedSetIndices.has(index) ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Display balls */}
                    <div className="flex items-center gap-2">
                      {set.mainBalls.map((ball, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-lucky-primary text-white font-bold text-sm flex items-center justify-center"
                        >
                          {ball}
                        </div>
                      ))}
                      <div className="w-2" />
                      <div className="w-10 h-10 rounded-full bg-lucky-ball-red text-white font-bold text-sm flex items-center justify-center">
                        {set.bonusBall}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save All Button */}
              {generatedSets.length > 1 && savedSetIndices.size < generatedSets.length && (
                <button
                  onClick={handleSaveAll}
                  className="w-full py-3 rounded-xl font-medium text-white bg-lucky-secondary hover:bg-lucky-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save All {generatedSets.length} Sets
                </button>
              )}

              {/* Generate Again */}
              <button
                onClick={handleGenerateAgain}
                className="w-full py-3 rounded-xl font-medium text-lucky-text dark:text-lucky-dark-text bg-lucky-surface dark:bg-lucky-dark-surface border-2 border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Generate Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <Disclaimer variant="compact" />
    </div>
  );
}
