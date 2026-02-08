import Dexie, { Table } from 'dexie';
import { GeneratedSet, HistoricalDraw, UserSettings } from '@/types';

export class LuckyLensDatabase extends Dexie {
  generatedSets!: Table<GeneratedSet, number>;
  historicalDraws!: Table<HistoricalDraw, number>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('LuckyLensDB');
    
    this.version(1).stores({
      generatedSets: '++id, timestamp, gameId, saved, generationType, batchId',
      historicalDraws: '++id, gameId, date, [gameId+date]',
      settings: '++id',
    });
  }
}

export const db = new LuckyLensDatabase();

export async function getSettings(): Promise<UserSettings> {
  const settings = await db.settings.toArray();
  if (settings.length > 0) {
    return settings[0];
  }
  
  const defaultSettings: UserSettings = {
    theme: 'system',
    defaultGameId: 'powerball',
    notificationsEnabled: true,
    autoSaveGenerated: false,
    noRepeat: false,
    defaultSetCount: 1,
  };
  
  await db.settings.add(defaultSettings);
  return defaultSettings;
}

export async function updateSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  
  if (current.id) {
    await db.settings.update(current.id, updated);
  } else {
    await db.settings.add(updated);
  }
}
