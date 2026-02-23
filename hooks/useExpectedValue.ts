'use client';

import { useState, useEffect, useCallback } from 'react';
import { LotteryGame, EVResult, TierEV, JackpotData, PrizeTier } from '@/types';

// ---------------------------------------------------------------------------
// Tax constants
// ---------------------------------------------------------------------------

/** Federal top marginal rate applied to jackpot lump-sum (2024) */
const JACKPOT_FEDERAL_RATE = 0.37;

/** Federal withholding rate for non-jackpot prizes > $5,000 */
const WITHHOLDING_RATE = 0.24;

/** California state lottery tax rate: 0% */
// const CA_STATE_TAX = 0; // CA does not tax lottery winnings

/** Estimated lump-sum as fraction of advertised jackpot (cash value option) */
const LUMP_SUM_FRACTION = 0.60;

// ---------------------------------------------------------------------------
// EV computation
// ---------------------------------------------------------------------------

/**
 * Computes after-tax prize for a given tier.
 * California has 0% state lottery tax; federal rates apply per bracket.
 */
function afterTaxPrize(tier: PrizeTier, jackpotLumpSum: number): number {
  if (tier.isJackpot) {
    // Apply 37% top federal rate to lump sum
    return jackpotLumpSum * (1 - JACKPOT_FEDERAL_RATE);
  }
  if (tier.prize > 5000) {
    // 24% federal withholding for prizes > $5,000
    return tier.prize * (1 - WITHHOLDING_RATE);
  }
  // Prizes ≤ $5,000: no withholding
  return tier.prize;
}

export function computeEV(
  game: LotteryGame,
  jackpotAmount: number,
  lumpSumAmount?: number
): EVResult {
  const lumpSum = lumpSumAmount ?? jackpotAmount * LUMP_SUM_FRACTION;
  const tierBreakdown: TierEV[] = [];
  let ev = 0;

  for (const tier of game.prizeTiers) {
    const probability = 1 / tier.odds;
    const netPrize = afterTaxPrize(tier, lumpSum);
    const evContribution = netPrize * probability;
    ev += evContribution;

    tierBreakdown.push({
      tier,
      afterTaxPrize: netPrize,
      probability,
      evContribution,
    });
  }

  // Advantage meter: 0% = EV $0, 50% = break-even, 100% = EV >= 2× cost
  const meterValue = Math.min(100, (ev / game.ticketCost) * 50);

  let verdict: EVResult['verdict'];
  if (meterValue >= 50) {
    verdict = 'buy';
  } else if (meterValue >= 35) {
    verdict = 'approaching';
  } else {
    verdict = 'negative';
  }

  return {
    ev,
    meterValue,
    verdict,
    ticketCost: game.ticketCost,
    jackpotAmount,
    lumpSumAmount: lumpSum,
    tierBreakdown,
  };
}

// ---------------------------------------------------------------------------
// Jackpot cache via localStorage
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cacheKey(gameId: string): string {
  return `luckylens_jackpot_${gameId}`;
}

function readCachedJackpot(gameId: string): JackpotData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(cacheKey(gameId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as JackpotData;
    parsed.fetchedAt = new Date(parsed.fetchedAt);
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedJackpot(data: JackpotData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(cacheKey(data.gameId), JSON.stringify(data));
  } catch {
    // Storage quota or private mode — fail silently
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseExpectedValueResult {
  ev: number | null;
  meterValue: number | null;
  verdict: EVResult['verdict'] | null;
  ticketCost: number;
  jackpotAmount: number | null;
  lumpSumAmount: number | null;
  tierBreakdown: TierEV[];
  isStale: boolean;
  isLoading: boolean;
  setManualJackpot: (amount: number) => void;
}

/**
 * Fetches and caches the current jackpot amount for a game, then computes
 * the after-tax expected value per ticket across all prize tiers.
 *
 * Jackpot is read from the most recent Magayo API result. The value reflects
 * the jackpot from the last drawing (not necessarily the current advertised
 * jackpot). Use setManualJackpot() to override with a known current value.
 *
 * DISCLAIMER: EV calculation assumes a solo jackpot winner. Actual EV is
 * lower at high jackpot amounts due to increased ticket sales.
 */
export function useExpectedValue(game: LotteryGame): UseExpectedValueResult {
  const [jackpotAmount, setJackpotAmount] = useState<number | null>(null);
  const [lumpSumAmount, setLumpSumAmount] = useState<number | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch jackpot from Magayo API or fall back to cache
  useEffect(() => {
    if (game.prizeTiers.length === 0) return; // unsupported games (Daily 3/4)

    const cached = readCachedJackpot(game.id);
    const now = Date.now();

    if (cached) {
      setJackpotAmount(cached.jackpotAmount);
      setLumpSumAmount(cached.lumpSumAmount ?? null);
      const age = now - new Date(cached.fetchedAt).getTime();
      setIsStale(age > CACHE_TTL_MS);

      if (age <= CACHE_TTL_MS) return; // cache is fresh, skip fetch
    }

    setIsLoading(true);

    fetch(`/api/lottery?game=${game.id}`)
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(data => {
        // Magayo returns an array of results; pick the most recent
        let jackpot: number | null = null;

        if (Array.isArray(data) && data.length > 0) {
          const raw = data[0]?.jackpot ?? data[0]?.jackpotAmount ?? null;
          if (raw) {
            const parsed = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
            if (!isNaN(parsed) && parsed > 0) jackpot = parsed;
          }
        } else if (data?.jackpot || data?.jackpotAmount) {
          const raw = data?.jackpot ?? data?.jackpotAmount;
          const parsed = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed) && parsed > 0) jackpot = parsed;
        }

        if (jackpot !== null) {
          const cacheData: JackpotData = {
            gameId: game.id,
            jackpotAmount: jackpot,
            fetchedAt: new Date(),
          };
          writeCachedJackpot(cacheData);
          setJackpotAmount(jackpot);
          setLumpSumAmount(null);
          setIsStale(false);
        }
      })
      .catch(() => {
        // API unavailable — keep cached value if present; allow manual input
        if (cached) {
          setIsStale(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [game.id, game.prizeTiers.length]);

  const setManualJackpot = useCallback(
    (amount: number) => {
      setJackpotAmount(amount);
      setLumpSumAmount(null);
      setIsStale(false);
      writeCachedJackpot({
        gameId: game.id,
        jackpotAmount: amount,
        fetchedAt: new Date(),
      });
    },
    [game.id]
  );

  // Derive EV result
  let evResult: EVResult | null = null;
  if (jackpotAmount !== null && game.prizeTiers.length > 0) {
    evResult = computeEV(game, jackpotAmount, lumpSumAmount ?? undefined);
  }

  return {
    ev: evResult?.ev ?? null,
    meterValue: evResult?.meterValue ?? null,
    verdict: evResult?.verdict ?? null,
    ticketCost: game.ticketCost,
    jackpotAmount,
    lumpSumAmount,
    tierBreakdown: evResult?.tierBreakdown ?? [],
    isStale,
    isLoading,
    setManualJackpot,
  };
}
