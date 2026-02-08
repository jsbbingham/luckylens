import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { GeneratedSet } from '@/types';
import { generateUniqueId } from '@/lib/utils';

export function useHistory() {
  /**
   * Save multiple sets to the database with a shared batch ID.
   */
  const saveSets = async (sets: Omit<GeneratedSet, 'id'>[]): Promise<void> => {
    const batchId = generateUniqueId();
    
    const setsWithBatchId = sets.map(set => ({
      ...set,
      batchId,
    }));
    
    await db.generatedSets.bulkAdd(setsWithBatchId as GeneratedSet[]);
  };

  /**
   * Get the most recently saved set for a specific game.
   * Returns null if no saved sets exist.
   */
  const getLastSavedSet = async (
    gameId: string
  ): Promise<{ mainBalls: number[]; bonusBall: number } | null> => {
    const lastSet = await db.generatedSets
      .where('gameId')
      .equals(gameId)
      .and(set => set.saved === true)
      .reverse()
      .first();
    
    if (!lastSet) return null;
    
    return {
      mainBalls: lastSet.primaryNumbers,
      bonusBall: lastSet.secondaryNumbers[0],
    };
  };

  /**
   * Get all saved sets, optionally filtered by game.
   * Ordered by timestamp descending (most recent first).
   */
  const getAllSets = async (gameFilter?: string): Promise<GeneratedSet[]> => {
    let query = db.generatedSets
      .orderBy('timestamp')
      .reverse();
    
    if (gameFilter && gameFilter !== 'all') {
      query = query.filter(set => set.gameId === gameFilter);
    }
    
    return query.toArray();
  };

  /**
   * Get total count of all saved sets.
   */
  const getSetCount = async (): Promise<number> => {
    return db.generatedSets.count();
  };

  /**
   * Delete a single set by ID.
   */
  const deleteSet = async (id: number): Promise<void> => {
    await db.generatedSets.delete(id);
  };

  /**
   * Clear all saved sets.
   */
  const clearAllSets = async (): Promise<void> => {
    await db.generatedSets.clear();
  };

  /**
   * Clear all sets for a specific game.
   */
  const clearSetsByGame = async (gameId: string): Promise<void> => {
    const setsToDelete = await db.generatedSets
      .where('gameId')
      .equals(gameId)
      .primaryKeys();
    
    await db.generatedSets.bulkDelete(setsToDelete);
  };

  /**
   * React hook: Get all sets with live query.
   */
  const useAllSets = (gameFilter?: string) => {
    return useLiveQuery(
      async () => {
        if (!gameFilter || gameFilter === 'all') {
          return db.generatedSets.orderBy('timestamp').reverse().toArray();
        }
        return db.generatedSets
          .where('gameId')
          .equals(gameFilter)
          .reverse()
          .sortBy('timestamp');
      },
      [gameFilter]
    ) ?? [];
  };

  /**
   * React hook: Get total count with live query.
   */
  const useTotalGeneratedCount = () => {
    return useLiveQuery(
      () => db.generatedSets.count(),
      []
    ) ?? 0;
  };

  /**
   * Group sets by batchId for display.
   */
  const groupSetsByBatch = (sets: GeneratedSet[]): Map<string | undefined, GeneratedSet[]> => {
    const groups = new Map<string | undefined, GeneratedSet[]>();
    
    for (const set of sets) {
      const batchId = set.batchId;
      if (!groups.has(batchId)) {
        groups.set(batchId, []);
      }
      groups.get(batchId)!.push(set);
    }
    
    return groups;
  };

  return {
    saveSets,
    getLastSavedSet,
    getAllSets,
    getSetCount,
    deleteSet,
    clearAllSets,
    clearSetsByGame,
    useAllSets,
    useTotalGeneratedCount,
    groupSetsByBatch,
  };
}
