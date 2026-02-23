export interface PrizeTier {
  label: string;       // e.g. "5+PB", "5+0", "4+1"
  prize: number;       // fixed prize in USD (0 = jackpot placeholder)
  isJackpot: boolean;
  odds: number;        // 1-in-X value (the X)
}

export interface LotteryGame {
  id: string;
  name: string;
  region: string;
  primaryColor: string;
  secondaryColor: string;
  primaryCount: number;
  primaryMax: number;
  secondaryCount: number;
  secondaryMax: number;
  description: string;
  drawDays: string[];
  dataFile?: string;
  nextDrawDate: () => Date;
  bonusBallLabel: string;
  isDemoData?: boolean; // Flag for games using static demo data
  ticketCost: number;
  prizeTiers: PrizeTier[];
  supportsWheeling: boolean;
  supportsBirthdayFilter: boolean;
}

export interface GeneratedSet {
  id?: number;
  timestamp: Date;
  gameId: string;
  primaryNumbers: number[];
  secondaryNumbers: number[];
  generationType: 'random' | 'trend' | 'manual' | 'strategic' | 'wheeling';
  saved: boolean;
  notes?: string;
  batchId?: string;
}

export interface HistoricalDraw {
  id?: number;
  date: Date;
  gameId: string;
  primaryNumbers: number[];
  secondaryNumbers: number[];
  jackpot: string;
  winners: number;
  postedAt?: Date; // When results were officially posted/synced
}

export interface DrawResultJson {
  drawDate: string;
  mainBalls: number[];
  bonusBall: number;
  jackpotAmount: string;
}

export interface TrendData {
  gameId: string;
  hotNumbers: number[];
  coldNumbers: number[];
  dueNumbers: number[];
  frequencyMap: Map<number, number>;
  oddEvenDistribution: { odd: number; even: number };
  highLowDistribution: { high: number; low: number };
}

export interface UserSettings {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  defaultGameId: string;
  notificationsEnabled: boolean;
  autoSaveGenerated: boolean;
  noRepeat: boolean;
  defaultSetCount: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Aliases for consistency with the codebase
export type SavedNumberSet = GeneratedSet;
export type DrawResult = HistoricalDraw;

// Additional properties for history display
export interface HistorySet extends GeneratedSet {
  id: number;
}

// --- Wheeling ---

export interface CoverageStats {
  totalTriples: number;
  coveredTriples: number;
  coveragePercent: number;
  ticketCount: number;
  isFull: boolean;
}

export interface WheelingResult {
  tickets: number[][];
  coverageStats: CoverageStats;
  isFull: boolean;
  disclaimer?: string;
}

// --- Expected Value ---

export interface TierEV {
  tier: PrizeTier;
  afterTaxPrize: number;
  probability: number;
  evContribution: number;
}

export interface EVResult {
  ev: number;
  meterValue: number;          // 0–100 scale
  verdict: 'buy' | 'approaching' | 'negative';
  ticketCost: number;
  jackpotAmount: number;
  lumpSumAmount: number;
  tierBreakdown: TierEV[];
}

export interface JackpotData {
  gameId: string;
  jackpotAmount: number;
  lumpSumAmount?: number;
  fetchedAt: Date;
}
