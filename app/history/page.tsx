'use client';

import { useState, useMemo, useCallback } from 'react';
import { History, Trash2, Dices, TrendingUp, Hand, AlertTriangle } from 'lucide-react';
import { LOTTERY_GAMES, getGameById } from '@/lib/games';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/hooks/useToast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { formatRelativeTime } from '@/lib/utils';
import { GeneratedSet } from '@/types';

type GenerationType = 'random' | 'trend' | 'manual';

interface HistorySet extends GeneratedSet {
  id: number;
}

const methodConfig: Record<GenerationType, { label: string; color: string; icon: typeof Dices }> = {
  random: { label: 'Random', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Dices },
  trend: { label: 'Trend', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: TrendingUp },
  manual: { label: 'Self-Pick', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Hand },
};

export default function HistoryPage() {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [setsToShow, setSetsToShow] = useState(20);
  const [deleteSetId, setDeleteSetId] = useState<number | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const { useAllSets, deleteSet, clearAllSets, getSetCount, groupSetsByBatch } = useHistory();
  const { showToast } = useToast();

  const allSets = useAllSets(selectedGameFilter);
  const totalCount = useHistory().useTotalGeneratedCount();

  // Group sets by batch
  const groupedSets = useMemo(() => {
    return groupSetsByBatch(allSets);
  }, [allSets, groupSetsByBatch]);

  // Get batches in order (most recent first based on first set in batch)
  const batches = useMemo(() => {
    const batchEntries = Array.from(groupedSets.entries());
    // Sort by timestamp of first set in batch (most recent first)
    return batchEntries.sort((a, b) => {
      const timeA = a[1][0]?.timestamp?.getTime() || 0;
      const timeB = b[1][0]?.timestamp?.getTime() || 0;
      return timeB - timeA;
    });
  }, [groupedSets]);

  // Flatten for pagination display
  const flattenedSets = useMemo(() => {
    const result: { set: HistorySet; isBatchStart: boolean; batchSize: number; batchId?: string }[] = [];
    
    for (const [batchId, sets] of batches) {
      sets.forEach((set, index) => {
        result.push({
          set: set as HistorySet,
          isBatchStart: index === 0,
          batchSize: sets.length,
          batchId: batchId || undefined,
        });
      });
    }
    
    return result.slice(0, setsToShow);
  }, [batches, setsToShow]);

  const hasMore = allSets.length > setsToShow;

  const handleDelete = useCallback(async () => {
    if (deleteSetId === null) return;
    
    await deleteSet(deleteSetId);
    showToast('Set deleted', 'success');
    setDeleteSetId(null);
  }, [deleteSetId, deleteSet, showToast]);

  const handleClearAll = useCallback(async () => {
    await clearAllSets();
    showToast('All history cleared', 'success');
    setShowClearAllConfirm(false);
  }, [clearAllSets, showToast]);

  const handleLoadMore = useCallback(() => {
    setSetsToShow(prev => prev + 20);
  }, []);

  // Empty state
  if (allSets.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-4">
          <History className="w-8 h-8 mx-auto text-lucky-text-muted dark:text-lucky-dark-text-muted mb-2" />
          <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
            Your Number History
          </h1>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎱</div>
          <h2 className="text-xl font-semibold text-lucky-text dark:text-lucky-dark-text mb-2">
            No saved numbers yet!
          </h2>
          <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted mb-6">
            Generate or pick some numbers to get started.
          </p>
          <a
            href="/generate?mode=random"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-lucky-primary hover:bg-lucky-primary-hover transition-colors"
          >
            <Dices className="w-5 h-5" />
            Generate Numbers
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
            Your Number History
          </h1>
          <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
            {totalCount} saved {totalCount === 1 ? 'set' : 'sets'}
          </p>
        </div>
        
        <button
          onClick={() => setShowClearAllConfirm(true)}
          className="px-3 py-2 rounded-lg text-sm font-medium text-lucky-error hover:bg-lucky-error/10 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Game Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedGameFilter('all')}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
            transition-colors
            ${selectedGameFilter === 'all'
              ? 'bg-gradient-to-r from-lucky-primary to-lucky-secondary text-white'
              : 'bg-lucky-surface dark:bg-lucky-dark-surface text-lucky-text dark:text-lucky-dark-text border border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover'
            }
          `}
        >
          All Games
        </button>
        {LOTTERY_GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGameFilter(game.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-colors flex items-center gap-2
              ${selectedGameFilter === game.id
                ? 'bg-gradient-to-r from-lucky-primary to-lucky-secondary text-white'
                : 'bg-lucky-surface dark:bg-lucky-dark-surface text-lucky-text dark:text-lucky-dark-text border border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover'
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full ${game.primaryColor.replace('bg-', 'bg-')}`} />
            {game.name}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {flattenedSets.map(({ set, isBatchStart, batchSize, batchId }) => {
          const game = getGameById(set.gameId);
          if (!game) return null;

          const method = methodConfig[set.generationType as GenerationType] || methodConfig.random;
          const MethodIcon = method.icon;

          return (
            <div
              key={set.id}
              className={`
                relative
                ${isBatchStart && batchSize > 1 ? 'border-l-4 border-lucky-primary pl-4' : ''}
              `}
            >
              {/* Batch label */}
              {isBatchStart && batchSize > 1 && (
                <div className="text-xs font-medium text-lucky-primary mb-2">
                  Batch • {batchSize} sets
                </div>
              )}

              <div className="p-4 bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl border border-lucky-border dark:border-lucky-dark-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Game name and method */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-3 h-3 rounded-full ${game.primaryColor}`} />
                      <span className="font-medium text-lucky-text dark:text-lucky-dark-text">
                        {game.name}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${method.color}`}>
                        <MethodIcon className="w-3 h-3" />
                        {method.label}
                      </span>
                    </div>

                    {/* Numbers */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {set.primaryNumbers.map((num, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full ${game.primaryColor} text-white font-bold text-sm flex items-center justify-center`}
                        >
                          {num}
                        </div>
                      ))}
                      <div className="w-2" />
                      {set.secondaryNumbers.map((num, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full ${game.secondaryColor} text-white font-bold text-sm flex items-center justify-center`}
                        >
                          {num}
                        </div>
                      ))}
                      {set.secondaryNumbers.length > 1 && (
                        <span className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted ml-1">
                          Bonus
                        </span>
                      )}
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
                      {formatRelativeTime(set.timestamp)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteSetId(set.id!)}
                    className="p-2 rounded-lg text-lucky-text-muted dark:text-lucky-dark-text-muted hover:text-lucky-error hover:bg-lucky-error/10 transition-colors"
                    aria-label="Delete set"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full py-3 rounded-xl font-medium text-lucky-text dark:text-lucky-dark-text bg-lucky-surface dark:bg-lucky-dark-surface border-2 border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors"
        >
          Load More ({allSets.length - setsToShow} remaining)
        </button>
      )}

      {/* Delete Single Confirm */}
      <ConfirmDialog
        isOpen={deleteSetId !== null}
        onCancel={() => setDeleteSetId(null)}
        onConfirm={handleDelete}
        title="Delete this set?"
        message="This action cannot be undone."
        confirmLabel="Delete"
      />

      {/* Clear All Confirm */}
      <ConfirmDialog
        isOpen={showClearAllConfirm}
        onCancel={() => setShowClearAllConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear all history?"
        message={`Delete all ${totalCount} saved number sets? This cannot be undone.`}
        confirmLabel="Clear All"
      />
    </div>
  );
}
