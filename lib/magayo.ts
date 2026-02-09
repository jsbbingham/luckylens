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
    
    // Parse results string: "25,36,42,51,58,06,2"
    // Format: main ball 1-5, bonus ball, multiplier (optional)
    const parts = data.results.split(',').map((p: string) => parseInt(p, 10));
    
    return {
      date: data.draw,
      mainBalls: parts.slice(0, 5),
      bonusBall: parts[5],
      multiplier: parts[6] || undefined,
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
