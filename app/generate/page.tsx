'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Dices, Target, Grid3X3, Loader2, Save, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { GameSelector } from '@/components/GameSelector';
import { SetCountSelector } from '@/components/SetCountSelector';
import { BallRevealAnimation } from '@/components/BallRevealAnimation';
import { Disclaimer } from '@/components/Disclaimer';
import WheelingMode from '@/components/WheelingMode';
import { useToast } from '@/hooks/useToast';
import { getDefaultGame } from '@/lib/games';
import { generateMultipleSets } from '@/lib/random';
import { generateMultipleStrategicSets } from '@/lib/strategic-random';
import { useHistory } from '@/hooks/useHistory';
import { useSettings } from '@/hooks/useSettings';
import { LotteryGame } from '@/types';
import { generateUniqueId } from '@/lib/utils';

type GenerateTab = 'quick' | 'strategic' | 'wheeling';

interface LocalSet {
  mainBalls: number[];
  bonusBall: number;
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-lucky-primary" />
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}

function GeneratePageContent() {
  const [activeTab, setActiveTab] = useState<GenerateTab>('quick');
  const [selectedGame, setSelectedGame] = useState<LotteryGame>(getDefaultGame());
  const [setCount, setSetCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSets, setGeneratedSets] = useState<LocalSet[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [savedSetIndices, setSavedSetIndices] = useState<Set<number>>(new Set());
  const [animationComplete, setAnimationComplete] = useState(false);

  const { settings } = useSettings();
  const { saveSets, getLastSavedSet } = useHistory();
  const { showToast } = useToast();

  // Load default set count from settings
  useEffect(() => {
    if (settings?.defaultSetCount) {
      setSetCount(settings.defaultSetCount);
    }
  }, [settings]);

  // Clear results when tab changes
  useEffect(() => {
    setGeneratedSets([]);
    setSavedSetIndices(new Set());
    setAnimationComplete(false);
  }, [activeTab]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedSets([]);
    setSavedSetIndices(new Set());
    setAnimationComplete(false);

    const lastSet = settings?.noRepeat
      ? await getLastSavedSet(selectedGame.id)
      : null;

    let sets: LocalSet[];

    if (activeTab === 'strategic') {
      const results = generateMultipleStrategicSets(
        selectedGame,
        setCount,
        settings?.noRepeat ?? false,
        lastSet
      );
      sets = results.map(r => ({ mainBalls: r.mainBalls, bonusBall: r.bonusBall }));
    } else {
      sets = generateMultipleSets(
        selectedGame,
        setCount,
        settings?.noRepeat ?? false,
        lastSet
      );
    }

    setGeneratedSets(sets);
    setIsGenerating(false);
    setIsAnimating(true);
  }, [activeTab, selectedGame, setCount, settings, getLastSavedSet]);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    setAnimationComplete(true);
  }, []);

  const handleSaveSet = useCallback(
    async (setIndex: number) => {
      const set = generatedSets[setIndex];
      if (!set) return;

      const batchId = generateUniqueId();
      const generationType = activeTab === 'strategic' ? 'strategic' : 'random';

      await saveSets([
        {
          timestamp: new Date(),
          gameId: selectedGame.id,
          primaryNumbers: set.mainBalls,
          secondaryNumbers: set.bonusBall > 0 ? [set.bonusBall] : [],
          generationType,
          saved: true,
          notes: '',
          batchId,
        },
      ]);

      setSavedSetIndices(prev => {
        const next = new Set(prev);
        next.add(setIndex);
        return next;
      });
      showToast('Saved!', 'success');
    },
    [generatedSets, selectedGame.id, activeTab, saveSets, showToast]
  );

  const handleSaveAll = useCallback(async () => {
    const batchId = generateUniqueId();
    const generationType = (activeTab === 'strategic' ? 'strategic' : 'random') as 'strategic' | 'random';

    const setsToSave = generatedSets.map(set => ({
      timestamp: new Date(),
      gameId: selectedGame.id,
      primaryNumbers: set.mainBalls,
      secondaryNumbers: set.bonusBall > 0 ? [set.bonusBall] : [],
      generationType,
      saved: true,
      notes: '',
      batchId,
    }));

    await saveSets(setsToSave);
    setSavedSetIndices(new Set(generatedSets.map((_, i) => i)));
    showToast(`All ${generatedSets.length} sets saved!`, 'success');
  }, [generatedSets, selectedGame.id, activeTab, saveSets, showToast]);

  const handleGenerateAgain = useCallback(() => {
    setGeneratedSets([]);
    setSavedSetIndices(new Set());
    setAnimationComplete(false);
  }, []);

  const isPickTab = activeTab === 'quick' || activeTab === 'strategic';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
          Generate Numbers
        </h1>
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted mt-1">
          Choose a generation method below
        </p>
      </div>

      {/* Game Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
          Select Lottery Game
        </label>
        <GameSelector selectedGame={selectedGame} onSelectGame={setSelectedGame} />
      </div>

      {/* Tab Bar */}
      <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
        <TabButton
          active={activeTab === 'quick'}
          onClick={() => setActiveTab('quick')}
          icon={<Dices className="w-4 h-4" />}
          label="Quick Pick"
        />
        <TabButton
          active={activeTab === 'strategic'}
          onClick={() => setActiveTab('strategic')}
          icon={<Target className="w-4 h-4" />}
          label="Strategic"
        />
        <TabButton
          active={activeTab === 'wheeling'}
          onClick={() => setActiveTab('wheeling')}
          icon={<Grid3X3 className="w-4 h-4" />}
          label="Wheeling"
        />
      </div>

      {/* Tab description */}
      {activeTab === 'quick' && (
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted -mt-2">
          Cryptographically secure random numbers with no filtering.
        </p>
      )}
      {activeTab === 'strategic' && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 -mt-2">
          <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Payout Optimized</strong> — avoids birthday-clustered numbers
            (1–31) and common grid patterns to reduce expected co-winner dilution.
          </p>
        </div>
      )}
      {activeTab === 'wheeling' && (
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted -mt-2">
          Abbreviated wheeling guarantees a minimum prize if any 3 of your chosen
          numbers appear in the draw.
        </p>
      )}

      {/* Wheeling tab content */}
      {activeTab === 'wheeling' && <WheelingMode game={selectedGame} />}

      {/* Quick Pick / Strategic tab content */}
      {isPickTab && (
        <>
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
                ${activeTab === 'strategic'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
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

          {/* Strategic: warning for unsupported games */}
          {activeTab === 'strategic' && !selectedGame.supportsBirthdayFilter && generatedSets.length === 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Birthday filter is not applied for {selectedGame.name} (number range
                too small). Pattern scrubber is still active.
              </p>
            </div>
          )}

          {/* Results Area */}
          {generatedSets.length > 0 && (
            <div className="space-y-6">
              <BallRevealAnimation
                sets={generatedSets}
                game={selectedGame}
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
              />

              {animationComplete && (
                <div className="space-y-4 animate-fade-in">
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
                            {activeTab === 'strategic' && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                Payout Optimized
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

                        <div className="flex items-center gap-2 flex-wrap">
                          {set.mainBalls.map((ball, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full bg-lucky-primary text-white font-bold text-sm flex items-center justify-center"
                            >
                              {ball}
                            </div>
                          ))}
                          {set.bonusBall > 0 && (
                            <>
                              <div className="w-2" />
                              <div className="w-10 h-10 rounded-full bg-lucky-ball-red text-white font-bold text-sm flex items-center justify-center">
                                {set.bonusBall}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {generatedSets.length > 1 &&
                    savedSetIndices.size < generatedSets.length && (
                      <button
                        onClick={handleSaveAll}
                        className="w-full py-3 rounded-xl font-medium text-white bg-lucky-secondary hover:bg-lucky-secondary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Save All {generatedSets.length} Sets
                      </button>
                    )}

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
        </>
      )}

      {/* Disclaimer */}
      <Disclaimer variant="compact" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TabButton
// ---------------------------------------------------------------------------

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
        text-sm font-medium transition-all duration-150
        ${active
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
