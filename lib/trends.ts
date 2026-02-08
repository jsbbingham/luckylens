/**
 * Trends Analysis Module
 * Pure utility functions for lottery number frequency analysis
 */

import { HistoricalDraw, LotteryGame } from '@/types';

export interface FrequencyEntry {
  number: number;
  count: number;
  lastDrawn: string;
}

export interface FrequencyResult {
  mainFrequencies: FrequencyEntry[];
  bonusFrequencies: FrequencyEntry[];
}

/**
 * Compute frequencies for all numbers in a game's pools
 */
export function computeFrequencies(
  results: HistoricalDraw[],
  game: LotteryGame
): FrequencyResult {
  // Initialize frequency tracking for main balls
  const mainFreqMap = new Map<number, { count: number; lastDate: Date | null }>();
  for (let i = 1; i <= game.primaryMax; i++) {
    mainFreqMap.set(i, { count: 0, lastDate: null });
  }

  // Initialize frequency tracking for bonus balls
  const bonusFreqMap = new Map<number, { count: number; lastDate: Date | null }>();
  for (let i = 1; i <= game.secondaryMax; i++) {
    bonusFreqMap.set(i, { count: 0, lastDate: null });
  }

  // Count occurrences
  for (const draw of results) {
    const drawDate = new Date(draw.date);

    // Main balls
    for (const num of draw.primaryNumbers) {
      const current = mainFreqMap.get(num);
      if (current) {
        current.count++;
        if (!current.lastDate || drawDate > current.lastDate) {
          current.lastDate = drawDate;
        }
      }
    }

    // Bonus balls
    for (const num of draw.secondaryNumbers) {
      const current = bonusFreqMap.get(num);
      if (current) {
        current.count++;
        if (!current.lastDate || drawDate > current.lastDate) {
          current.lastDate = drawDate;
        }
      }
    }
  }

  // Convert to arrays and sort by count descending
  const mainFrequencies: FrequencyEntry[] = Array.from(mainFreqMap.entries())
    .map(([number, data]) => ({
      number,
      count: data.count,
      lastDrawn: data.lastDate ? formatDate(data.lastDate) : 'Never',
    }))
    .sort((a, b) => b.count - a.count);

  const bonusFrequencies: FrequencyEntry[] = Array.from(bonusFreqMap.entries())
    .map(([number, data]) => ({
      number,
      count: data.count,
      lastDrawn: data.lastDate ? formatDate(data.lastDate) : 'Never',
    }))
    .sort((a, b) => b.count - a.count);

  return { mainFrequencies, bonusFrequencies };
}

/**
 * Get top N numbers by frequency
 */
export function getHotNumbers(
  frequencies: FrequencyEntry[],
  count: number
): { number: number; count: number }[] {
  return frequencies
    .slice(0, count)
    .map(f => ({ number: f.number, count: f.count }));
}

/**
 * Get bottom N numbers by frequency (least frequent first)
 */
export function getColdNumbers(
  frequencies: FrequencyEntry[],
  count: number
): { number: number; count: number }[] {
  // Filter to numbers that have appeared at least once, then get least frequent
  const appeared = frequencies.filter(f => f.count > 0);
  const never = frequencies.filter(f => f.count === 0);
  
  // Return least frequent of those that appeared, plus zeros if needed
  const result = [...appeared.slice(-count), ...never].slice(-count);
  return result.map(f => ({ number: f.number, count: f.count }));
}

/**
 * Compute average even/odd distribution per draw
 */
export function computeEvenOddAverage(
  results: HistoricalDraw[]
): { avgEven: number; avgOdd: number } {
  if (results.length === 0) {
    return { avgEven: 0, avgOdd: 0 };
  }

  let totalEven = 0;
  let totalOdd = 0;

  for (const draw of results) {
    for (const num of draw.primaryNumbers) {
      if (num % 2 === 0) {
        totalEven++;
      } else {
        totalOdd++;
      }
    }
  }

  return {
    avgEven: parseFloat((totalEven / results.length).toFixed(1)),
    avgOdd: parseFloat((totalOdd / results.length).toFixed(1)),
  };
}

/**
 * Compute average high/low distribution per draw
 * High = number > midpoint of range
 */
export function computeHighLowAverage(
  results: HistoricalDraw[],
  game: LotteryGame
): { avgHigh: number; avgLow: number } {
  if (results.length === 0) {
    return { avgHigh: 0, avgLow: 0 };
  }

  const midpoint = Math.floor(game.primaryMax / 2);
  let totalHigh = 0;
  let totalLow = 0;

  for (const draw of results) {
    for (const num of draw.primaryNumbers) {
      if (num > midpoint) {
        totalHigh++;
      } else {
        totalLow++;
      }
    }
  }

  return {
    avgHigh: parseFloat((totalHigh / results.length).toFixed(1)),
    avgLow: parseFloat((totalLow / results.length).toFixed(1)),
  };
}

/**
 * Format a date to string
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Interpolate between two hex colors
 * Returns a hex color string
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  // Parse hex colors
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get color for a hot number based on its rank (0 = hottest)
 */
export function getHotColor(rank: number, total: number): string {
  // Deep red (#FF4500) to warm yellow (#FFD700)
  const factor = rank / Math.max(total - 1, 1);
  return interpolateColor('#FF4500', '#FFD700', factor);
}

/**
 * Get color for a cold number based on its rank (0 = coldest)
 */
export function getColdColor(rank: number, total: number): string {
  // Deep blue (#0044CC) to light blue (#88CCFF)
  const factor = rank / Math.max(total - 1, 1);
  return interpolateColor('#0044CC', '#88CCFF', factor);
}
