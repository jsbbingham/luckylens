'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Calendar, AlertTriangle, ChevronDown } from 'lucide-react';
import { GameSelector } from '@/components/GameSelector';
import { Disclaimer } from '@/components/Disclaimer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { useDrawResults } from '@/hooks/useDrawResults';
import { getDefaultGame, getGameById } from '@/lib/games';
import { LotteryGame, HistoricalDraw } from '@/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function ResultsPage() {
  const [selectedGame, setSelectedGame] = useState<LotteryGame>(getDefaultGame());
  const [results, setResults] = useState<HistoricalDraw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [autoSyncAttempted, setAutoSyncAttempted] = useState(false);

  const { 
    syncResults, 
    getDrawResults, 
    getResultCount, 
    getLastSyncDate,
    getAvailableMonths,
    hasDrawResults,
    clearResults,
    isSyncing 
  } = useDrawResults();
  const { showToast } = useToast();

  const limit = 20;

  // Load results for selected game
  const loadResults = useCallback(async (resetOffset = true) => {
    setIsLoading(true);
    const newOffset = resetOffset ? 0 : offset;
    
    try {
      const data = await getDrawResults(selectedGame.id, {
        limit,
        offset: newOffset,
        month: selectedMonth === 'all' ? undefined : selectedMonth,
      });
      
      if (resetOffset) {
        setResults(data);
      } else {
        setResults(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === limit);
      if (!resetOffset) {
        setOffset(newOffset + data.length);
      } else {
        setOffset(data.length);
      }
    } catch (error) {
      showToast('Failed to load results', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGame.id, selectedMonth, offset, getDrawResults, showToast]);

  // Auto-sync on first visit if no data exists
  useEffect(() => {
    const checkAndSync = async () => {
      if (autoSyncAttempted) return;
      
      const hasData = await hasDrawResults(selectedGame.id);
      if (!hasData) {
        setIsLoading(true);
        try {
          const { success, count, error } = await syncResults(selectedGame.id);
          if (success) {
            showToast(`Synced! ${count} draws loaded for ${selectedGame.name}`, 'success');
            await loadResults(true);
            // Load available months after sync
            const months = await getAvailableMonths(selectedGame.id);
            setAvailableMonths(months);
          } else {
            showToast(error || 'Sync failed', 'error');
          }
        } catch (err) {
          showToast('Auto-sync failed', 'error');
        } finally {
          setIsLoading(false);
          setAutoSyncAttempted(true);
        }
      } else {
        // Load existing data
        await loadResults(true);
        const months = await getAvailableMonths(selectedGame.id);
        setAvailableMonths(months);
        setAutoSyncAttempted(true);
      }
    };
    
    checkAndSync();
  }, [selectedGame.id]); // Only run when game changes

  // Reload when month filter changes
  useEffect(() => {
    if (autoSyncAttempted) {
      loadResults(true);
    }
  }, [selectedMonth]);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const { success, count, error } = await syncResults(selectedGame.id);
      if (success) {
        showToast(`Synced! ${count} draws loaded for ${selectedGame.name}`, 'success');
        await loadResults(true);
        const months = await getAvailableMonths(selectedGame.id);
        setAvailableMonths(months);
      } else {
        showToast(error || 'Sync failed', 'error');
      }
    } catch (err) {
      showToast('Sync failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearResults(selectedGame.id);
      setResults([]);
      setAvailableMonths([]);
      showToast('Results cleared', 'success');
      setShowClearConfirm(false);
    } catch (err) {
      showToast('Failed to clear results', 'error');
    }
  };

  const handleLoadMore = () => {
    loadResults(false);
  };

  const lastSyncDate = getLastSyncDate(selectedGame.id);

  // Format month for display
  const formatMonth = (monthStr: string) => {
    if (monthStr === 'all') return 'All Months';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-lucky-gold" />
          <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
            Past Winning Numbers
          </h1>
        </div>
        <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
          View and sync historical lottery results
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

      {/* Sync Controls */}
      <div className="flex items-center justify-between p-4 bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl border border-lucky-border dark:border-lucky-dark-border">
        <div>
          <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
            {lastSyncDate 
              ? `Last synced: ${formatRelativeTime(new Date(lastSyncDate))}`
              : 'Never synced'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-lucky-error hover:bg-lucky-error/10 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-lucky-primary hover:bg-lucky-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Results'}
          </button>
        </div>
      </div>

      {/* Month Filter */}
      {availableMonths.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
            Filter by Month
          </label>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full appearance-none px-4 py-3 rounded-xl bg-lucky-surface dark:bg-lucky-dark-surface border border-lucky-border dark:border-lucky-dark-border text-lucky-text dark:text-lucky-dark-text focus:outline-none focus:ring-2 focus:ring-lucky-primary"
            >
              <option value="all">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{formatMonth(month)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lucky-text-muted pointer-events-none" />
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-lucky-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text mb-2">
              No results available
            </h3>
            <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted mb-4">
              No results found for {selectedGame.name}. Tap Sync to load past winning numbers.
            </p>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-6 py-3 rounded-xl font-medium text-white bg-lucky-primary hover:bg-lucky-primary-hover transition-colors disabled:opacity-50"
            >
              {isSyncing ? 'Syncing...' : 'Sync Results'}
            </button>
          </div>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className="p-4 bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl border border-lucky-border dark:border-lucky-dark-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-lucky-text dark:text-lucky-dark-text">
                    {formatDate(result.date)}
                  </p>
                  {result.jackpot && (
                    <p className="text-sm text-lucky-gold font-medium">
                      {result.jackpot}
                    </p>
                  )}
                </div>
              </div>

              {/* Numbers */}
              <div className="flex items-center gap-2 flex-wrap">
                {result.primaryNumbers.map((num, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${selectedGame.primaryColor} text-white font-bold text-sm flex items-center justify-center`}
                  >
                    {num}
                  </div>
                ))}
                <div className="w-2" />
                {result.secondaryNumbers.map((num, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${selectedGame.secondaryColor} text-white font-bold text-sm flex items-center justify-center`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && results.length > 0 && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-medium text-lucky-text dark:text-lucky-dark-text bg-lucky-surface dark:bg-lucky-dark-surface border-2 border-lucky-border dark:border-lucky-dark-border hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}

      {/* Clear Confirm */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title="Clear all results?"
        message={`Delete all synced results for ${selectedGame.name}? This cannot be undone.`}
        confirmLabel="Clear"
      />

      {/* Disclaimer */}
      <Disclaimer variant="compact" />
    </div>
  );
}
