'use client';

import { useState } from 'react';
import { AlertTriangle, Shield, Grid3X3 } from 'lucide-react';
import { LotteryGame } from '@/types';
import {
  generateWheelTickets,
  generateBudgetWheelTickets,
  PoolSize,
} from '@/lib/wheeling';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/hooks/useToast';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CoverageBadge({
  covered,
  total,
  isFull,
}: {
  covered: number;
  total: number;
  isFull: boolean;
}) {
  const pct = Math.round((covered / total) * 10) / 10;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
        isFull
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      }`}
    >
      {isFull ? (
        <Shield className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      {covered}/{total} triples covered ({pct}%)
    </span>
  );
}

function TicketRow({
  index,
  numbers,
  bonusBallLabel,
}: {
  index: number;
  numbers: number[];
  bonusBallLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="w-6 text-xs text-gray-400 font-mono">
        #{index + 1}
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {numbers.map((n, i) => (
          <span
            key={i}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm font-mono font-semibold"
          >
            {n.toString().padStart(2, '0')}
          </span>
        ))}
      </div>
      {bonusBallLabel && (
        <span className="text-xs text-gray-400 ml-1">
          (no bonus – pick any {bonusBallLabel})
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface WheelingModeProps {
  game: LotteryGame;
}

type WheelingMode = 'full' | 'budget';

export default function WheelingMode({ game }: WheelingModeProps) {
  const { saveSets } = useHistory();
  const { showToast } = useToast();

  const [poolSize, setPoolSize] = useState<PoolSize>(9);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<WheelingMode>('full');
  const [tickets, setTickets] = useState<number[][] | null>(null);
  const [coverage, setCoverage] = useState<{
    covered: number;
    total: number;
    isFull: boolean;
    disclaimer?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Wheeling only for 5-pick games
  if (!game.supportsWheeling) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-2">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Grid3X3 className="w-5 h-5" />
          <span className="font-medium">Wheeling not available</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Abbreviated wheeling requires a 5-pick game. {game.name} uses{' '}
          {game.primaryCount} numbers and does not support this mode.
        </p>
      </div>
    );
  }

  function toggleNumber(n: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(n)) {
        next.delete(n);
      } else if (next.size < poolSize) {
        next.add(n);
      }
      return next;
    });
    // Clear results when pool changes
    setTickets(null);
    setCoverage(null);
  }

  function handlePoolSizeChange(v: PoolSize) {
    setPoolSize(v);
    setSelected(new Set()); // reset selection on pool size change
    setTickets(null);
    setCoverage(null);
  }

  function handleCompute() {
    if (selected.size !== poolSize) return;

    const pool = Array.from(selected).sort((a, b) => a - b);

    const result =
      mode === 'full'
        ? generateWheelTickets(pool, poolSize)
        : generateBudgetWheelTickets(pool, poolSize, 7);

    setTickets(result.tickets);
    setCoverage({
      covered: result.coverageStats.coveredTriples,
      total: result.coverageStats.totalTriples,
      isFull: result.isFull,
      disclaimer: result.disclaimer,
    });
  }

  async function handleSaveAll() {
    if (!tickets) return;
    setIsSaving(true);
    try {
      const sets = tickets.map(ticket => ({
        timestamp: new Date(),
        gameId: game.id,
        primaryNumbers: ticket,
        secondaryNumbers: [],
        generationType: 'wheeling' as const,
        saved: true,
      }));
      await saveSets(sets);
      showToast(`Saved ${tickets.length} wheeling tickets`, 'success');
    } catch {
      showToast('Failed to save tickets', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  const remainingToSelect = poolSize - selected.size;

  return (
    <div className="space-y-4">
      {/* Pool size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
          Pool size:
        </span>
        {([8, 9, 10] as PoolSize[]).map(v => (
          <button
            key={v}
            onClick={() => handlePoolSizeChange(v)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              poolSize === v
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {v} numbers
          </button>
        ))}
      </div>

      {/* Selection counter */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {selected.size < poolSize ? (
          <>
            Select{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {remainingToSelect}
            </span>{' '}
            more number{remainingToSelect !== 1 ? 's' : ''} (
            {selected.size}/{poolSize})
          </>
        ) : (
          <span className="text-green-600 dark:text-green-400 font-medium">
            Pool complete — {poolSize} numbers selected ✓
          </span>
        )}
      </p>

      {/* Number grid */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: game.primaryMax }, (_, i) => i + 1).map(n => {
            const isSelected = selected.has(n);
            const isFull = selected.size >= poolSize && !isSelected;
            return (
              <button
                key={n}
                onClick={() => toggleNumber(n)}
                disabled={isFull}
                className={`
                  aspect-square rounded-lg text-xs font-mono font-semibold
                  transition-all flex items-center justify-center
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : isFull
                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300'
                  }
                `}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('full')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
            mode === 'full'
              ? 'bg-green-600 border-green-600 text-white'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-400'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-1.5 mb-0.5" />
          Full Guarantee
          {poolSize === 9 && ' (12 tickets)'}
          {poolSize === 8 && ' (8 tickets)'}
          {poolSize === 10 && ' (17 tickets)'}
        </button>
        <button
          onClick={() => setMode('budget')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
            mode === 'budget'
              ? 'bg-yellow-500 border-yellow-500 text-white'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-yellow-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4 inline mr-1.5 mb-0.5" />
          Budget Mode (7 tickets)
        </button>
      </div>

      {mode === 'budget' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            This is <strong>NOT</strong> a full guarantee. Some three-number
            combinations from your pool will not be covered.
          </p>
        </div>
      )}

      {/* Compute button */}
      <button
        onClick={handleCompute}
        disabled={selected.size !== poolSize}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
          selected.size === poolSize
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        Compute Coverage
      </button>

      {/* Results */}
      {tickets && coverage && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CoverageBadge
              covered={coverage.covered}
              total={coverage.total}
              isFull={coverage.isFull}
            />
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : `Save All (${tickets.length} tickets)`}
            </button>
          </div>

          {coverage.disclaimer && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {coverage.disclaimer}
              </p>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {tickets.length} playslip{tickets.length !== 1 ? 's' : ''} generated
              {game.bonusBallLabel &&
                ` — choose any ${game.bonusBallLabel} for each`}
            </div>
            {tickets.map((ticket, i) => (
              <TicketRow
                key={i}
                index={i}
                numbers={ticket}
                bonusBallLabel={game.bonusBallLabel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
