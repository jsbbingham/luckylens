import { LotteryGame } from '@/types';
import { cryptoRandomInt } from './random';

// ---------------------------------------------------------------------------
// Filter helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the sorted number set forms a constant-difference sequence
 * (arithmetic progression with 5 numbers).
 */
function isArithmeticProgression(nums: number[]): boolean {
  if (nums.length < 3) return false;
  const diff = nums[1] - nums[0];
  if (diff === 0) return false;
  for (let i = 2; i < nums.length; i++) {
    if (nums[i] - nums[i - 1] !== diff) return false;
  }
  return true;
}

/**
 * Returns true if all 5 numbers are sequential (e.g., 12–16).
 * isArithmeticProgression already catches this (diff=1), but we keep it
 * explicit for clarity.
 */
function isFullyConsecutive(nums: number[]): boolean {
  return nums[nums.length - 1] - nums[0] === nums.length - 1;
}

/**
 * Returns true if all 5 numbers fall in the same tens group
 * (e.g., all in 21–30: ⌊(n-1)/10⌋ identical for all n).
 */
function isSameDecade(nums: number[]): boolean {
  const decade = Math.floor((nums[0] - 1) / 10);
  return nums.every(n => Math.floor((n - 1) / 10) === decade);
}

/**
 * Maps a lottery number to its position on a 10-column play-slip grid.
 * Row = ⌊(n-1)/10⌋, Col = (n-1) % 10.
 */
function toGrid(n: number): { row: number; col: number } {
  return { row: Math.floor((n - 1) / 10), col: (n - 1) % 10 };
}

/**
 * Returns true if 3+ points in the grid are collinear (2D cross-product test).
 * Checks every C(5,3) = 10 triple.
 */
function hasGridCollinearity(nums: number[]): boolean {
  const points = nums.map(toGrid);
  for (let i = 0; i < points.length - 2; i++) {
    for (let j = i + 1; j < points.length - 1; j++) {
      for (let k = j + 1; k < points.length; k++) {
        const ax = points[j].col - points[i].col;
        const ay = points[j].row - points[i].row;
        const bx = points[k].col - points[i].col;
        const by = points[k].row - points[i].row;
        // Cross product == 0 → collinear
        if (ax * by - ay * bx === 0) return true;
      }
    }
  }
  return false;
}

/**
 * Returns true if the set passes the birthday-trap filter.
 * Requires at least 3 of 5 main numbers to be STRICTLY > 31.
 * Only called when game.supportsBirthdayFilter is true.
 */
function passesBirthdayFilter(nums: number[]): boolean {
  return nums.filter(n => n > 31).length >= 3;
}

/**
 * Returns true if the set passes all four pattern scrubbers.
 */
function passesPatternFilter(nums: number[]): boolean {
  if (isArithmeticProgression(nums)) return false;
  if (isFullyConsecutive(nums)) return false;
  if (isSameDecade(nums)) return false;
  if (hasGridCollinearity(nums)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Random set generator (no replacement)
// ---------------------------------------------------------------------------

function drawMainBalls(game: LotteryGame): number[] {
  const balls: number[] = [];
  const used = new Set<number>();
  while (balls.length < game.primaryCount) {
    const n = cryptoRandomInt(1, game.primaryMax);
    if (!used.has(n)) {
      used.add(n);
      balls.push(n);
    }
  }
  balls.sort((a, b) => a - b);
  return balls;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface StrategicSetResult {
  mainBalls: number[];
  bonusBall: number;
  birthdayFilterApplied: boolean;
  patternFilterApplied: boolean;
  attemptsRequired: number;
}

/**
 * Generates a single strategic set for a lottery game.
 *
 * Applies the birthday-trap filter (when supported) and four pattern scrubbers
 * to bias selections away from human-clustered combinations, reducing the
 * expected number of co-winners.
 */
export function generateStrategicSet(game: LotteryGame): StrategicSetResult {
  const birthdayFilterApplied = game.supportsBirthdayFilter;
  const patternFilterApplied = game.primaryCount === 5;

  let attempts = 0;
  let usePatternFilter = patternFilterApplied;
  let useBirthdayFilter = birthdayFilterApplied;

  while (true) {
    attempts++;

    // Safety valve: relax pattern filter after 10,000 attempts
    if (attempts === 10001) {
      console.warn(
        `[strategic-random] ${game.id}: relaxing pattern filter after ${attempts} attempts`
      );
      usePatternFilter = false;
    }

    // Safety valve: relax birthday filter after 20,000 attempts
    if (attempts === 20001) {
      console.warn(
        `[strategic-random] ${game.id}: relaxing birthday filter after ${attempts} attempts`
      );
      useBirthdayFilter = false;
    }

    const mainBalls = drawMainBalls(game);

    if (useBirthdayFilter && !passesBirthdayFilter(mainBalls)) continue;
    if (usePatternFilter && !passesPatternFilter(mainBalls)) continue;

    const bonusBall =
      game.secondaryMax > 0 ? cryptoRandomInt(1, game.secondaryMax) : 0;

    return {
      mainBalls,
      bonusBall,
      birthdayFilterApplied: useBirthdayFilter,
      patternFilterApplied: usePatternFilter,
      attemptsRequired: attempts,
    };
  }
}

/**
 * Generates multiple strategic sets with optional no-repeat logic.
 */
export function generateMultipleStrategicSets(
  game: LotteryGame,
  count: number,
  noRepeat: boolean = false,
  lastSavedSet?: { mainBalls: number[]; bonusBall: number } | null
): StrategicSetResult[] {
  const results: StrategicSetResult[] = [];
  const maxRetries = 10;

  for (let i = 0; i < count; i++) {
    let result = generateStrategicSet(game);
    let retries = 0;

    if (noRepeat) {
      let isDuplicate = false;
      do {
        isDuplicate = false;

        if (
          lastSavedSet &&
          result.mainBalls.join(',') === lastSavedSet.mainBalls.join(',') &&
          result.bonusBall === lastSavedSet.bonusBall
        ) {
          isDuplicate = true;
        }

        for (const existing of results) {
          if (
            result.mainBalls.join(',') === existing.mainBalls.join(',') &&
            result.bonusBall === existing.bonusBall
          ) {
            isDuplicate = true;
            break;
          }
        }

        if (isDuplicate && retries < maxRetries) {
          result = generateStrategicSet(game);
          retries++;
        }
      } while (isDuplicate && retries < maxRetries);
    }

    results.push(result);
  }

  return results;
}
