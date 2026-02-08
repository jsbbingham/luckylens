import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '@/types';
import { getSettings, updateSettings as updateDbSettings } from '@/lib/db';

interface UseSettingsReturn {
  settings: UserSettings | null;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Set default settings on error
      setSettings({
        theme: 'system',
        defaultGameId: 'powerball',
        notificationsEnabled: true,
        autoSaveGenerated: false,
        noRepeat: false,
        defaultSetCount: 1,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    try {
      await updateDbSettings(newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    await loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    updateSettings,
    refreshSettings,
  };
}
