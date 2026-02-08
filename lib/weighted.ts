import { LotteryGame } from '@/types';
import { cryptoRandomInt, generateRandomSet, generateMultipleSets } from './random';

interface WeightedPoolItem {
  value: number;
  weight: number;
}

/**
 * Performs weighted random selection without replacement.
 * 
 * @param pool - Array of items with their weights
 * @param count - Number of items to select
 * @returns Selected values sorted ascending
 */
export function weightedRandomSelect(pool: WeightedPoolItem[], count: number): number[] {
  if (pool.length === 0 || count === 0) return [];
  if (count > pool.length) count = pool.length;
  
  const selected: number[] = [];
  // Create a mutable copy of the pool
  let mutablePool = [...pool];
  
  for (let i = 0; i < count; i++) {
    // Calculate total weight of remaining pool
    const totalWeight = mutablePool.reduce((sum, item) => sum + item.weight, 0);
    
    if (totalWeight <= 0) {
      // Fallback to uniform random if all weights are 0
      const randomIndex = cryptoRandomInt(0, mutablePool.length - 1);
      selected.push(mutablePool[randomIndex].value);
      mutablePool.splice(randomIndex, 1);
      continue;
    }
    
    // Generate random value in [0, totalWeight)
    const randomValue = cryptoRandomInt(0, Math.floor(totalWeight) - 1);
    
    // Select item based on accumulated weights
    let accumulatedWeight = 0;
    let selectedIndex = -1;
    
    for (let j = 0; j < mutablePool.length; j++) {
      accumulatedWeight += mutablePool[j].weight;
      if (randomValue < accumulatedWeight) {
        selectedIndex = j;
        break;
      }
    }
    
    // Fallback if somehow nothing was selected (shouldn't happen)
    if (selectedIndex === -1) {
      selectedIndex = mutablePool.length - 1;
    }
    
    selected.push(mutablePool[selectedIndex].value);
    mutablePool.splice(selectedIndex, 1);
  }
  
  // Return sorted ascending
  return selected.sort((a, b) => a - b);
}

/**
 * Generates a trend-based set using frequency data.
 * Weight = frequency + 1 (so even 0-frequency numbers have a small chance).
 * Falls back to random generation if frequencies are empty.
 */
export function generateTrendBasedSet(
  game: LotteryGame,
  mainFrequencies: Map<number, number>,
  bonusFrequencies: Map<number, number>
): { mainBalls: number[]; bonusBall: number } {
  // Check if we have any frequency data
  const hasMainData = mainFrequencies.size > 0;
  const hasBonusData = bonusFrequencies.size > 0;
  
  // Build weighted pool for main balls
  const mainPool: WeightedPoolItem[] = [];
  for (let i = 1; i <= game.primaryMax; i++) {
    const frequency = hasMainData ? (mainFrequencies.get(i) || 0) : 0;
    mainPool.push({
      value: i,
      weight: frequency + 1, // +1 ensures even unplayed numbers have a chance
    });
  }
  
  // Select main balls using weighted random
  const mainBalls = weightedRandomSelect(mainPool, game.primaryCount);
  
  // Build weighted pool for bonus ball
  const bonusPool: WeightedPoolItem[] = [];
  for (let i = 1; i <= game.secondaryMax; i++) {
    const frequency = hasBonusData ? (bonusFrequencies.get(i) || 0) : 0;
    bonusPool.push({
      value: i,
      weight: frequency + 1,
    });
  }
  
  // Select bonus ball using weighted random (single selection)
  const bonusBalls = weightedRandomSelect(bonusPool, 1);
  const bonusBall = bonusBalls[0];
  
  return { mainBalls, bonusBall };
}

/**
 * Checks if two sets are identical.
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
 * Generates multiple trend-based sets with optional no-repeat logic.
 * Falls back to pure random generation if no frequency data exists.
 */
export function generateMultipleTrendSets(
  game: LotteryGame,
  mainFrequencies: Map<number, number>,
  bonusFrequencies: Map<number, number>,
  count: number,
  noRepeat: boolean,
  lastSavedSet?: { mainBalls: number[]; bonusBall: number } | null
): { mainBalls: number[]; bonusBall: number }[] {
  // Check if we have any frequency data
  const hasData = mainFrequencies.size > 0 || bonusFrequencies.size > 0;
  
  if (!hasData) {
    // Fall back to pure random generation
    return generateMultipleSets(game, count, noRepeat, lastSavedSet);
  }
  
  const sets: { mainBalls: number[]; bonusBall: number }[] = [];
  const maxRetries = 10;
  
  for (let i = 0; i < count; i++) {
    let newSet = generateTrendBasedSet(game, mainFrequencies, bonusFrequencies);
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
          newSet = generateTrendBasedSet(game, mainFrequencies, bonusFrequencies);
          retries++;
        }
      } while (isDuplicate && retries < maxRetries);
    }
    
    sets.push(newSet);
  }
  
  return sets;
}
