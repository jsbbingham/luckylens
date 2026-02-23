import { WheelingResult, CoverageStats } from '@/types';

// ---------------------------------------------------------------------------
// Covering Designs — Abbreviated Wheeling
//
// Each design is a minimum set of 5-element blocks (tickets) that guarantees
// at least one ticket will contain all t=3 elements from ANY t-subset chosen
// from a v-element pool. Blocks are 0-indexed into the sorted user pool.
//
// Notation: C(v, k, t) — v pool size, k ticket size, t guarantee
// All designs verified by verifyCoveringDesign() at module load.
// ---------------------------------------------------------------------------

// C(8, 5, 3) — 8 blocks (optimal minimum)
const DESIGN_8: number[][] = [
  [0, 1, 2, 3, 4],
  [0, 1, 2, 5, 6],
  [0, 1, 3, 5, 7],
  [0, 2, 4, 5, 7],
  [0, 3, 4, 6, 7],
  [1, 2, 4, 6, 7],
  [1, 3, 4, 5, 6],
  [2, 3, 5, 6, 7],
];

// C(9, 5, 3) — 12 blocks (verified covering design)
const DESIGN_9: number[][] = [
  [0, 1, 2, 3, 4],
  [0, 1, 2, 5, 6],
  [0, 1, 3, 7, 8],
  [0, 2, 5, 7, 8],
  [0, 3, 4, 5, 7],
  [0, 4, 6, 7, 8],
  [1, 2, 3, 6, 8],
  [1, 3, 4, 5, 8],
  [1, 4, 6, 7, 8],
  [2, 3, 4, 6, 7],
  [2, 4, 5, 6, 8],
  [1, 2, 5, 7, 8],
];

// C(10, 5, 3) — 17 blocks (optimal minimum)
const DESIGN_10: number[][] = [
  [0, 1, 2, 3, 4],
  [0, 1, 2, 5, 6],
  [0, 1, 3, 7, 8],
  [0, 1, 4, 7, 9],
  [0, 2, 4, 8, 9],
  [0, 3, 5, 6, 9],
  [0, 4, 5, 6, 8],
  [0, 6, 7, 8, 9],
  [1, 2, 4, 6, 9],
  [1, 2, 7, 8, 9],
  [1, 3, 4, 5, 6],
  [1, 3, 5, 8, 9],
  [1, 5, 6, 7, 8],
  [2, 3, 4, 7, 9],
  [2, 3, 5, 6, 8],
  [2, 4, 5, 7, 8],
  [3, 4, 6, 8, 9],
];

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

/**
 * Generates all C(v, t) t-element subsets from indices 0..v-1.
 */
function allSubsets(v: number, t: number): number[][] {
  const result: number[][] = [];
  const indices = Array.from({ length: t }, (_, i) => i);

  while (true) {
    result.push([...indices]);

    // Find the rightmost index that can be incremented
    let i = t - 1;
    while (i >= 0 && indices[i] === v - t + i) i--;
    if (i < 0) break;

    indices[i]++;
    for (let j = i + 1; j < t; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }

  return result;
}

/**
 * Verifies that every t-subset of 0..v-1 appears in at least one block.
 * Throws with details if any triple is not covered.
 */
export function verifyCoveringDesign(
  v: number,
  t: number,
  blocks: number[][]
): void {
  const triples = allSubsets(v, t);
  const missing: number[][] = [];

  for (const triple of triples) {
    const covered = blocks.some(block =>
      triple.every(idx => block.includes(idx))
    );
    if (!covered) missing.push(triple);
  }

  if (missing.length > 0) {
    throw new Error(
      `C(${v},5,${t}) design is incomplete — ${missing.length} uncovered triple(s): ` +
        missing.map(m => `{${m.join(',')}}`).join(', ')
    );
  }
}

// Run assertions at module load — fail loudly if a design is wrong
verifyCoveringDesign(8, 3, DESIGN_8);
verifyCoveringDesign(9, 3, DESIGN_9);
verifyCoveringDesign(10, 3, DESIGN_10);

// ---------------------------------------------------------------------------
// Coverage stats helper
// ---------------------------------------------------------------------------

function computeCoverageStats(
  v: number,
  t: number,
  blocks: number[][],
  isFull: boolean
): CoverageStats {
  const allTriples = allSubsets(v, t);
  const totalTriples = allTriples.length;

  const coveredSet = new Set<string>();
  for (const block of blocks) {
    for (const triple of allSubsets(block.length, t)) {
      const key = triple.map(i => block[i]).sort((a, b) => a - b).join(',');
      coveredSet.add(key);
    }
  }

  // Only count triples whose indices are all within 0..v-1
  let coveredTriples = 0;
  for (const triple of allTriples) {
    const key = triple.sort((a, b) => a - b).join(',');
    if (coveredSet.has(key)) coveredTriples++;
  }

  return {
    totalTriples,
    coveredTriples,
    coveragePercent: Math.round((coveredTriples / totalTriples) * 1000) / 10,
    ticketCount: blocks.length,
    isFull,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type PoolSize = 8 | 9 | 10;

/**
 * Generates all tickets for a full covering design.
 * pool must be sorted and have exactly v elements.
 */
export function generateWheelTickets(
  pool: number[],
  v: PoolSize
): WheelingResult {
  if (pool.length !== v) {
    throw new Error(`Pool must have exactly ${v} numbers, got ${pool.length}`);
  }

  const design = v === 8 ? DESIGN_8 : v === 9 ? DESIGN_9 : DESIGN_10;
  const tickets = design.map(block => block.map(idx => pool[idx]));
  const coverageStats = computeCoverageStats(v, 3, design.map(b => b.slice()), true);

  return { tickets, coverageStats, isFull: true };
}

/**
 * Generates a budget subset of tickets using greedy maximum coverage.
 * Stops at targetTickets (default 7). Only supported for v=9.
 * Not a full guarantee — UI must show disclaimer.
 */
export function generateBudgetWheelTickets(
  pool: number[],
  v: PoolSize = 9,
  targetTickets: number = 7
): WheelingResult {
  if (pool.length !== v) {
    throw new Error(`Pool must have exactly ${v} numbers, got ${pool.length}`);
  }

  const design = v === 8 ? DESIGN_8 : v === 9 ? DESIGN_9 : DESIGN_10;
  const allTriples = allSubsets(v, 3);
  const uncovered = new Set(allTriples.map(t => t.join(',')));

  const selected: number[][] = [];

  for (let i = 0; i < targetTickets && uncovered.size > 0; i++) {
    let bestBlock: number[] | null = null;
    let bestCoverage = -1;

    for (const block of design) {
      if (selected.includes(block)) continue;

      const blockTriples = allSubsets(block.length, 3).map(t =>
        t.map(idx => block[idx]).sort((a, b) => a - b).join(',')
      );
      const newlyCovered = blockTriples.filter(k => uncovered.has(k)).length;

      if (newlyCovered > bestCoverage) {
        bestCoverage = newlyCovered;
        bestBlock = block;
      }
    }

    if (bestBlock) {
      selected.push(bestBlock);
      const blockTriples = allSubsets(bestBlock.length, 3).map(t =>
        t.map(idx => bestBlock![idx]).sort((a, b) => a - b).join(',')
      );
      blockTriples.forEach(k => uncovered.delete(k));
    }
  }

  const tickets = selected.map(block => block.map(idx => pool[idx]));
  const totalTriples = allTriples.length;
  const coveredTriples = totalTriples - uncovered.size;
  const coveragePercent = Math.round((coveredTriples / totalTriples) * 1000) / 10;

  const coverageStats: CoverageStats = {
    totalTriples,
    coveredTriples,
    coveragePercent,
    ticketCount: tickets.length,
    isFull: false,
  };

  const uncoveredCount = totalTriples - coveredTriples;
  const disclaimer = `This is NOT a full guarantee. ${uncoveredCount} of ${totalTriples} three-number combinations are not covered.`;

  return { tickets, coverageStats, isFull: false, disclaimer };
}
