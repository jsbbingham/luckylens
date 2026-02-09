import { LotteryGame } from '@/types';

// Use local API proxy to avoid CORS issues
const API_BASE_URL = typeof window !== 'undefined' ? '' : 'https://www.magayo.com/api';
const USE_PROXY = true; // Set to true to use local API proxy

// Map internal game IDs to Magayo game IDs
const GAME_ID_MAP: Record<string, string> = {
  'powerball': 'us_powerball',
  'megamillions': 'us_mega_millions',
  'cash4life': 'us_cash4life',
  'lottoamerica': 'us_lotto_america',
  'superlottoplus': 'us_ca_lotto',
  'fantasy5': 'us_ca_fantasy',
  'daily3': 'us_ca_daily3_eve', // Using evening draw as default
  'daily4': 'us_ca_daily4',
  // Lucky for Life is not supported by Magayo
};

export interface MagayoResult {
  date: string;
  mainBalls: number[];
  bonusBall: number;
  jackpot?: string;
  multiplier?: number;
}

/**
 * Fetch latest results from Magayo API
 */
export async function fetchLatestResults(gameId: string): Promise<MagayoResult | null> {
  const magayoGameId = GAME_ID_MAP[gameId];
  
  if (!magayoGameId) {
    console.warn(`Game ${gameId} not supported by Magayo API`);
    return null;
  }
  
  try {
    // Use local proxy API to avoid CORS issues in browser
    const isBrowser = typeof window !== 'undefined';
    const apiUrl = isBrowser && USE_PROXY
      ? `/api/lottery?game=${magayoGameId}`
      : `https://www.magayo.com/api/results.php?api_key=rtAf5eNS3BGdVXh8fr&game=${magayoGameId}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error !== 0) {
      throw new Error(`Magayo API error: ${data.error}`);
    }

    // Handle different result formats
    // Daily 3/4: "845" or "0065" (single string of digits)
    // Other games: "25,36,42,51,58,06,2" (comma-separated)
    const resultsStr = data.results;

    // Check if this is a Daily 3 or Daily 4 game (no commas in results)
    if (!resultsStr.includes(',')) {
      // Split string into individual digits
      const digits = resultsStr.split('').map((d: string) => parseInt(d, 10));
      return {
        date: data.draw,
        mainBalls: digits,
        bonusBall: 0, // No bonus ball for daily games
        multiplier: undefined,
      };
    }

    // Standard comma-separated format
    const parts = resultsStr.split(',').map((p: string) => parseInt(p, 10));

    // Games without bonus balls (Fantasy 5, etc.)
    const gamesWithoutBonus = ['us_ca_fantasy'];
    const hasBonus = !gamesWithoutBonus.includes(magayoGameId);

    return {
      date: data.draw,
      mainBalls: hasBonus ? parts.slice(0, -1) : parts,
      bonusBall: hasBonus ? parts[parts.length - 1] : 0,
      multiplier: undefined,
    };
  } catch (error) {
    console.error('Magayo API error:', error);
    return null;
  }
}

/**
 * Fetch multiple historical results from Magayo API
 * Note: Magayo free tier typically only provides latest draw
 * For historical data, you may need to upgrade or use a different service
 */
export async function fetchHistoricalResults(
  gameId: string,
  days: number = 30
): Promise<MagayoResult[]> {
  const magayoGameId = GAME_ID_MAP[gameId];
  
  if (!magayoGameId) {
    console.warn(`Game ${gameId} not supported by Magayo API`);
    return [];
  }
  
  // Magayo free API only provides latest result
  // For historical data, we would need to either:
  // 1. Cache results over time
  // 2. Use a premium API tier
  // 3. Fetch from an alternative source
  
  const latest = await fetchLatestResults(gameId);
  return latest ? [latest] : [];
}

/**
 * Check if a game is supported by Magayo
 */
export function isSupportedByMagayo(gameId: string): boolean {
  return gameId in GAME_ID_MAP;
}

/**
 * Get all supported game IDs
 */
export function getSupportedMagayoGames(): string[] {
  return Object.keys(GAME_ID_MAP);
}
