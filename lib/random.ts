import { LotteryGame } from '@/types';

/**
 * Generates a cryptographically secure random integer in [min, max] inclusive.
 * Uses rejection sampling to eliminate modulo bias.
 */
export function cryptoRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  
  // Calculate how many random values we need to discard to avoid bias
  // We want: randomValue % range to be uniformly distributed
  const maxRandomValue = 0xFFFFFFFF; // 2^32 - 1
  const discardThreshold = maxRandomValue - (maxRandomValue % range);
  
  const array = new Uint32Array(1);
  
  while (true) {
    crypto.getRandomValues(array);
    const randomValue = array[0];
    
    // Rejection sampling: discard values that would create bias
    if (randomValue < discardThreshold) {
      return min + (randomValue % range);
    }
    // Otherwise, try again
  }
}

/**
 * Generates a single random set for a lottery game.
 * Main balls are drawn without replacement and sorted ascending.
 * Bonus ball is drawn from its separate range.
 */
export function generateRandomSet(game: LotteryGame): { mainBalls: number[]; bonusBall: number } {
  const mainBalls: number[] = [];
  const usedNumbers = new Set<number>();
  
  // Draw main balls without replacement
  while (mainBalls.length < game.primaryCount) {
    const num = cryptoRandomInt(1, game.primaryMax);
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num);
      mainBalls.push(num);
    }
  }
  
  // Sort main balls ascending
  mainBalls.sort((a, b) => a - b);
  
  // Draw bonus ball
  const bonusBall = cryptoRandomInt(1, game.secondaryMax);
  
  return { mainBalls, bonusBall };
}

/**
 * Checks if two sets are identical (same main balls in same order, same bonus ball).
 */
function setsAreEqual(
  set1: { mainBalls: number[]; bonusBall: number },
  set2: { mainBalls: number[]; bonusBall: number }
): boolean {
  if (set1.bonusBall !== set2.bonusBall) return false;
  if (set1.mainBalls.length !== set2.mainBalls.length) return false;
  
  for (let i = 0; i < set1.mainBalls.length; i++) {
    if (set1.mainBalls[i] !== set2.mainBalls[i]) return false;
  }
  
  return true;
}

/**
 * Generates multiple random sets with optional no-repeat logic.
 * 
 * @param game - The lottery game configuration
 * @param count - Number of sets to generate (1-5)
 * @param noRepeat - If true, prevents duplicate sets
 * @param lastSavedSet - The most recently saved set to check against (if noRepeat is true)
 * @returns Array of generated sets
 */
export function generateMultipleSets(
  game: LotteryGame,
  count: number,
  noRepeat: boolean,
  lastSavedSet?: { mainBalls: number[]; bonusBall: number } | null
): { mainBalls: number[]; bonusBall: number }[] {
  const sets: { mainBalls: number[]; bonusBall: number }[] = [];
  const maxRetries = 10;
  
  for (let i = 0; i < count; i++) {
    let newSet = generateRandomSet(game);
    let retries = 0;
    
    // Check for duplicates if noRepeat is enabled
    if (noRepeat) {
      let isDuplicate = false;
      
      do {
        isDuplicate = false;
        
        // Check against last saved set
        if (lastSavedSet && setsAreEqual(newSet, lastSavedSet)) {
          isDuplicate = true;
        }
        
        // Check against all previously generated sets in this batch
        for (const existingSet of sets) {
          if (setsAreEqual(newSet, existingSet)) {
            isDuplicate = true;
            break;
          }
        }
        
        // If duplicate, regenerate
        if (isDuplicate && retries < maxRetries) {
          newSet = generateRandomSet(game);
          retries++;
        }
      } while (isDuplicate && retries < maxRetries);
    }
    
    sets.push(newSet);
  }
  
  return sets;
}
