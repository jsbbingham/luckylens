'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import { LotteryGame } from '@/types';
import { useExpectedValue } from '@/hooks/useExpectedValue';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000)
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

function formatOdds(odds: number): string {
  if (odds >= 1_000_000)
    return `1 in ${(odds / 1_000_000).toFixed(1)}M`;
  if (odds >= 1_000) return `1 in ${(odds / 1_000).toFixed(1)}K`;
  return `1 in ${odds.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MeterBar({ value }: { value: number }) {
  const isGreen = value >= 50;
  const isYellow = value >= 35 && value < 50;
  const fillColor = isGreen
    ? 'bg-green-500'
    : isYellow
    ? 'bg-yellow-400'
    : 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${fillColor}`}
        style={{ width: `${Math.max(2, value)}%` }}
      />
    </div>
  );
}

interface VerdictBadgeProps {
  verdict: 'buy' | 'approaching' | 'negative';
}

function VerdictBadge({ verdict }: VerdictBadgeProps) {
  if (verdict === 'buy') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        <TrendingUp className="w-4 h-4" />
        Mathematical Buy
      </span>
    );
  }
  if (verdict === 'approaching') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
        <Minus className="w-4 h-4" />
        Approaching Value
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
      <TrendingDown className="w-4 h-4" />
      Negative Expectation
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface EVDashboardProps {
  game: LotteryGame;
}

export default function EVDashboard({ game }: EVDashboardProps) {
  const {
    ev,
    meterValue,
    verdict,
    ticketCost,
    jackpotAmount,
    tierBreakdown,
    isStale,
    isLoading,
    setManualJackpot,
  } = useExpectedValue(game);

  const [manualInput, setManualInput] = useState('');
  const [showManual, setShowManual] = useState(false);

  const hasData = game.prizeTiers.length > 0;

  if (!hasData) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Expected value analysis is not available for {game.name}.
        </p>
        <Disclaimer />
      </div>
    );
  }

  function handleManualSubmit() {
    const parsed = parseFloat(manualInput.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) {
      setManualJackpot(parsed);
      setShowManual(false);
      setManualInput('');
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Expected Value Analysis
        </h2>
        {isLoading && (
          <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Jackpot input */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jackpot (advertised)
            </span>
            {isStale && (
              <span className="inline-flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-3 h-3" />
                Cached data may be outdated
              </span>
            )}
          </div>
          <button
            onClick={() => setShowManual(v => !v)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Enter manually
          </button>
        </div>

        {jackpotAmount !== null ? (
          <p className="font-mono text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(jackpotAmount)}
          </p>
        ) : isLoading ? (
          <p className="text-sm text-gray-400">Fetching jackpot data…</p>
        ) : (
          <p className="text-sm text-gray-400">
            Could not load jackpot — enter manually below.
          </p>
        )}

        {showManual && (
          <div className="flex gap-2">
            <input
              type="number"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              placeholder="e.g. 500000000"
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Advantage Meter */}
      {ev !== null && meterValue !== null && verdict && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Advantage Meter
            </span>
            <VerdictBadge verdict={verdict} />
          </div>

          <MeterBar value={meterValue} />

          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 font-mono">
            <span>$0 EV</span>
            <span>Break-even</span>
            <span>2× cost</span>
          </div>

          {/* Split-risk disclaimer */}
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            EV assumes no jackpot split. Actual EV is lower when jackpots are
            high due to increased ticket sales.
          </p>

          {/* EV summary */}
          <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Expected value per{' '}
              <span className="font-mono">${ticketCost.toFixed(2)}</span>{' '}
              ticket:{' '}
              <span
                className={`font-mono font-semibold ${
                  verdict === 'buy'
                    ? 'text-green-600 dark:text-green-400'
                    : verdict === 'approaching'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                ${ev.toFixed(4)}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Prize tier breakdown */}
      {tierBreakdown.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Prize Tier Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-2 text-left">Match</th>
                  <th className="px-4 py-2 text-right">Prize</th>
                  <th className="px-4 py-2 text-right">After-tax</th>
                  <th className="px-4 py-2 text-right">Odds</th>
                  <th className="px-4 py-2 text-right">EV contrib.</th>
                </tr>
              </thead>
              <tbody>
                {tierBreakdown.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100 font-semibold">
                      {row.tier.label}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                      {row.tier.isJackpot
                        ? jackpotAmount !== null
                          ? formatCurrency(jackpotAmount)
                          : 'Jackpot'
                        : formatCurrency(row.tier.prize)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                      {formatCurrency(row.afterTaxPrize)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">
                      {formatOdds(row.tier.odds)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                      ${row.evContribution.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
      LuckyLens is an entertainment and educational tool. Lottery games have
      negative expected value under almost all conditions. No strategy can
      change the underlying odds of winning. Please play responsibly.
    </p>
  );
}
