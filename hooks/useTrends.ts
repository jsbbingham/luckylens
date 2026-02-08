'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { db } from '@/lib/db';
import { HistoricalDraw, LotteryGame } from '@/types';
import {
  computeFrequencies,
  getHotNumbers,
  getColdNumbers,
  computeEvenOddAverage,
  computeHighLowAverage,
  FrequencyEntry,
} from '@/lib/trends';

export interface UseTrendsResult {
  mainFrequencies: FrequencyEntry[];
  bonusFrequencies: FrequencyEntry[];
  hotMain: { number: number; count: number }[];
  coldMain: { number: number; count: number }[];
  hotBonus: { number: number; count: number }[];
  coldBonus: { number: number; count: number }[];
  evenOdd: { avgEven: number; avgOdd: number };
  highLow: { avgHigh: number; avgLow: number };
  drawCount: number;
  dateRange: { earliest: string; latest: string };
  isLoading: boolean;
  hasData: boolean;
}

/**
 * Hook to fetch and analyze trend data for a specific lottery game
 */
export function useTrends(gameId: string, game: LotteryGame): UseTrendsResult {
  const [draws, setDraws] = useState<HistoricalDraw[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load draws from database
  useEffect(() => {
    let isMounted = true;

    async function loadDraws() {
      setIsLoading(true);
      try {
        const results = await db.historicalDraws
          .where('gameId')
          .equals(gameId)
          .toArray();
        
        if (isMounted) {
          setDraws(results);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDraws();

    return () => {
      isMounted = false;
    };
  }, [gameId]);

  // Compute frequencies
  const frequencies = useMemo(() => {
    if (draws.length === 0) {
      return {
        mainFrequencies: [] as FrequencyEntry[],
        bonusFrequencies: [] as FrequencyEntry[],
      };
    }
    return computeFrequencies(draws, game);
  }, [draws, game]);

  // Compute hot numbers (top 10 main, top 5 bonus)
  const hotMain = useMemo(() => {
    return getHotNumbers(frequencies.mainFrequencies, 10);
  }, [frequencies.mainFrequencies]);

  const hotBonus = useMemo(() => {
    return getHotNumbers(frequencies.bonusFrequencies, 5);
  }, [frequencies.bonusFrequencies]);

  // Compute cold numbers (bottom 10 main, bottom 5 bonus)
  const coldMain = useMemo(() => {
    return getColdNumbers(frequencies.mainFrequencies, 10);
  }, [frequencies.mainFrequencies]);

  const coldBonus = useMemo(() => {
    return getColdNumbers(frequencies.bonusFrequencies, 5);
  }, [frequencies.bonusFrequencies]);

  // Compute even/odd average
  const evenOdd = useMemo(() => {
    return computeEvenOddAverage(draws);
  }, [draws]);

  // Compute high/low average
  const highLow = useMemo(() => {
    return computeHighLowAverage(draws, game);
  }, [draws, game]);

  // Compute date range
  const dateRange = useMemo(() => {
    if (draws.length === 0) {
      return { earliest: '', latest: '' };
    }

    const dates = draws.map(d => new Date(d.date));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      earliest: earliest.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      latest: latest.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
  }, [draws]);

  return {
    mainFrequencies: frequencies.mainFrequencies,
    bonusFrequencies: frequencies.bonusFrequencies,
    hotMain,
    coldMain,
    hotBonus,
    coldBonus,
    evenOdd,
    highLow,
    drawCount: draws.length,
    dateRange,
    isLoading,
    hasData: draws.length > 0,
  };
}
