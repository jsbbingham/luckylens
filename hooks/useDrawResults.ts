import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { DrawResultJson, HistoricalDraw } from '@/types';
import { getGameById } from '@/lib/games';
import { 
  fetchLatestResults, 
  fetchHistoricalResults, 
  isSupportedByMagayo,
  MagayoResult 
} from '@/lib/magayo';

export function useDrawResults() {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Convert Magayo result to HistoricalDraw format
   */
  const magayoToHistoricalDraw = useCallback((
    gameId: string,
    result: MagayoResult
  ): HistoricalDraw => {
    return {
      date: new Date(result.date),
      gameId,
      primaryNumbers: result.mainBalls,
      secondaryNumbers: [result.bonusBall],
      jackpot: result.jackpot || undefined,
      winners: 0,
    };
  }, []);

  /**
   * Sync results - uses Magayo API for supported games, falls back to static JSON
   */
  const syncResults = useCallback(async (
    gameId: string
  ): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      setIsSyncing(true);

      // Try Magayo API first for supported games
      if (isSupportedByMagayo(gameId)) {
        const results = await fetchHistoricalResults(gameId, 30);
        
        if (results.length > 0) {
          // Convert and store in Dexie
          for (const result of results) {
            const draw = magayoToHistoricalDraw(gameId, result);
            
            // Check for existing entry
            const existing = await db.historicalDraws
              .where({ gameId, date: draw.date })
              .first();

            if (!existing) {
              await db.historicalDraws.add(draw);
            }
          }

          // Update last sync date
          localStorage.setItem(`lastSync_${gameId}`, new Date().toISOString());
          
          return { success: true, count: results.length };
        }
      }

      // Fallback to static JSON for unsupported games or API failure
      const game = getGameById(gameId);
      const dataPath = game?.dataFile || `/data/${gameId}.json`;
      
      const response = await fetch(dataPath);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data: DrawResultJson[] = await response.json();

      const results = data.map(entry => ({
        date: new Date(entry.drawDate),
        gameId,
        primaryNumbers: entry.mainBalls,
        secondaryNumbers: [entry.bonusBall],
        jackpot: entry.jackpotAmount,
        winners: 0,
      }));

      // Upsert results to Dexie
      for (const result of results) {
        const existing = await db.historicalDraws
          .where({ gameId, date: result.date })
          .first();

        if (!existing) {
          await db.historicalDraws.add(result);
        }
      }

      // Update last sync date in localStorage
      localStorage.setItem(`lastSync_${gameId}`, new Date().toISOString());

      return { success: true, count: results.length };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsSyncing(false);
    }
  }, [magayoToHistoricalDraw]);

  /**
   * Fetch latest single result from Magayo API
   */
  const fetchLatestFromMagayo = useCallback(async (
    gameId: string
  ): Promise<HistoricalDraw | null> => {
    if (!isSupportedByMagayo(gameId)) {
      return null;
    }

    try {
      const result = await fetchLatestResults(gameId);
      if (result) {
        return magayoToHistoricalDraw(gameId, result);
      }
    } catch (error) {
      console.error('Failed to fetch from Magayo:', error);
    }
    
    return null;
  }, [magayoToHistoricalDraw]);

  /**
   * Get draw results for a game with optional filtering.
   */
  const getDrawResults = useCallback(async (
    gameId: string,
    options?: { limit?: number; offset?: number; month?: string }
  ): Promise<HistoricalDraw[]> => {
    let collection = db.historicalDraws
      .where('gameId')
      .equals(gameId)
      .reverse(); // Most recent first

    // Apply month filter if provided
    if (options?.month) {
      const startOfMonth = new Date(`${options.month}-01`);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      
      collection = collection.filter(
        draw => draw.date >= startOfMonth && draw.date < endOfMonth
      ) as any;
    }

    let results = await collection.toArray();

    // Apply pagination
    if (options?.offset) {
      results = results.slice(options.offset);
    }
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }, []);

  /**
   * Get total count of results for a game.
   */
  const getResultCount = useCallback(async (gameId: string): Promise<number> => {
    return db.historicalDraws.where('gameId').equals(gameId).count();
  }, []);

  /**
   * Get the last sync date for a game from localStorage.
   */
  const getLastSyncDate = useCallback((gameId: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`lastSync_${gameId}`);
  }, []);

  /**
   * Compute frequency counts for each number in draw history.
   */
  const getFrequencies = useCallback(async (
    gameId: string
  ): Promise<{ main: Map<number, number>; bonus: Map<number, number> }> => {
    const draws = await db.historicalDraws.where('gameId').equals(gameId).toArray();
    
    const mainFrequencies = new Map<number, number>();
    const bonusFrequencies = new Map<number, number>();
    
    for (const draw of draws) {
      // Count main ball frequencies
      for (const num of draw.primaryNumbers) {
        mainFrequencies.set(num, (mainFrequencies.get(num) || 0) + 1);
      }
      
      // Count bonus ball frequencies
      for (const num of draw.secondaryNumbers) {
        bonusFrequencies.set(num, (bonusFrequencies.get(num) || 0) + 1);
      }
    }
    
    return { main: mainFrequencies, bonus: bonusFrequencies };
  }, []);

  /**
   * Check if draw results exist for a game.
   */
  const hasDrawResults = useCallback(async (gameId: string): Promise<boolean> => {
    const count = await db.historicalDraws.where('gameId').equals(gameId).count();
    return count > 0;
  }, []);

  /**
   * Clear results for a game or all games.
   */
  const clearResults = useCallback(async (gameId?: string): Promise<void> => {
    if (gameId) {
      const keys = await db.historicalDraws
        .where('gameId')
        .equals(gameId)
        .primaryKeys();
      await db.historicalDraws.bulkDelete(keys);
      localStorage.removeItem(`lastSync_${gameId}`);
    } else {
      await db.historicalDraws.clear();
      // Clear all lastSync entries
      if (typeof window !== 'undefined') {
        Object.keys(localStorage)
          .filter(key => key.startsWith('lastSync_'))
          .forEach(key => localStorage.removeItem(key));
      }
    }
  }, []);

  /**
   * React hook: Get results with live query.
   */
  const useResults = (gameId?: string) => {
    return useLiveQuery(
      async () => {
        if (!gameId) return [];
        return db.historicalDraws
          .where('gameId')
          .equals(gameId)
          .reverse()
          .toArray();
      },
      [gameId]
    ) ?? [];
  };

  /**
   * Get available months from stored results.
   */
  const getAvailableMonths = useCallback(async (gameId: string): Promise<string[]> => {
    const results = await db.historicalDraws
      .where('gameId')
      .equals(gameId)
      .toArray();
    
    const months = new Set<string>();
    for (const result of results) {
      const month = result.date.toISOString().slice(0, 7); // YYYY-MM
      months.add(month);
    }
    
    return Array.from(months).sort().reverse();
  }, []);

  return {
    syncResults,
    getDrawResults,
    getResultCount,
    getLastSyncDate,
    getFrequencies,
    hasDrawResults,
    clearResults,
    useResults,
    getAvailableMonths,
    isSyncing,
    fetchLatestFromMagayo,
  };
}
