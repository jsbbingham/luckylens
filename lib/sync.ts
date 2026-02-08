import { HistoricalDraw, DrawResultJson } from '@/types';
import { GAMES_MAP } from './games';

/**
 * Fetches draw results for a specific game.
 * 
 * ===== FUTURE API INTEGRATION =====
 * When ready to connect a real lottery API:
 * 
 * 1. Set LOTTERY_API_URL and LOTTERY_API_KEY in .env.local
 * 
 * 2. Replace the fetch below with:
 *    const res = await fetch(`${process.env.LOTTERY_API_URL}/results/${gameId}`, {
 *      headers: { 'Authorization': `Bearer ${process.env.LOTTERY_API_KEY}` }
 *    });
 * 
 * 3. Map the API response to DrawResult[] format
 * 
 * Recommended APIs (budget: $15/month):
 * - magayo.com — reliable, covers US lotteries
 * - lotteryapi.com — REST-based, good documentation
 * 
 * ===================================
 */
export async function fetchDrawResults(gameId: string): Promise<HistoricalDraw[]> {
  const game = GAMES_MAP[gameId];
  if (!game) {
    throw new Error(`Unknown game: ${gameId}`);
  }

  // Currently reading from local JSON files
  const response = await fetch(game.dataFile || `/data/${gameId}.json`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${gameId}: ${response.statusText}`);
  }
  
  const data: DrawResultJson[] = await response.json();
  
  // Map JSON format to HistoricalDraw type
  return data.map(entry => ({
    date: new Date(entry.drawDate),
    gameId,
    primaryNumbers: entry.mainBalls,
    secondaryNumbers: [entry.bonusBall],
    jackpot: entry.jackpotAmount,
    winners: 0, // Not tracked in sample data
  }));
}

/**
 * Syncs game results with the database.
 * Upserts results to avoid duplicates (based on gameId + date compound key).
 */
export async function syncGameResults(
  gameId: string
): Promise<{ synced: number; total: number }> {
  const results = await fetchDrawResults(gameId);
  
  // In a real implementation, this would upsert to Dexie
  // For now, we just return the counts
  // The actual storage is handled by the useDrawResults hook
  
  return {
    synced: results.length,
    total: results.length,
  };
}
