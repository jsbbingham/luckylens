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
}

export interface GeneratedSet {
  id?: number;
  timestamp: Date;
  gameId: string;
  primaryNumbers: number[];
  secondaryNumbers: number[];
  generationType: 'random' | 'trend' | 'manual';
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
