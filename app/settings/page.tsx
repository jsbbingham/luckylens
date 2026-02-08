'use client';

import { useState } from 'react';
import { Settings, Sun, Moon, Monitor, Trash2, Database, Info, ExternalLink } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/useToast';
import { GameSelector } from '@/components/GameSelector';
import { SetCountSelector } from '@/components/SetCountSelector';
import { Toggle } from '@/components/Toggle';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getDefaultGame } from '@/lib/games';
import { LotteryGame } from '@/types';
import Link from 'next/link';
import { db } from '@/lib/db';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, isLoading } = useSettings();
  const { showToast } = useToast();
  
  const [defaultGame, setDefaultGame] = useState<LotteryGame>(getDefaultGame());
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'saved' | 'synced' | null;
  }>({ isOpen: false, type: null });

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    showToast('Theme updated', 'success');
  };

  // Handle default game change
  const handleDefaultGameChange = (game: LotteryGame) => {
    setDefaultGame(game);
    updateSettings({ defaultGameId: game.id });
    showToast('Default game updated', 'success');
  };

  // Handle default set count change
  const handleSetCountChange = (count: number) => {
    updateSettings({ defaultSetCount: count });
    showToast('Default set count updated', 'success');
  };

  // Handle no repeat toggle
  const handleNoRepeatChange = (checked: boolean) => {
    updateSettings({ noRepeat: checked });
    showToast(checked ? 'No repeat enabled' : 'No repeat disabled', 'success');
  };

  // Open confirm dialog
  const openConfirmDialog = (type: 'saved' | 'synced') => {
    setConfirmDialog({ isOpen: true, type });
  };

  // Handle clear saved numbers
  const handleClearSavedNumbers = async () => {
    try {
      await db.generatedSets.clear();
      showToast('All saved numbers cleared', 'success');
    } catch (error) {
      console.error('Failed to clear saved numbers:', error);
      showToast('Failed to clear saved numbers', 'error');
    }
    setConfirmDialog({ isOpen: false, type: null });
  };

  // Handle clear synced results
  const handleClearSyncedResults = async () => {
    try {
      await db.historicalDraws.clear();
      
      // Clear all lastSync_ localStorage keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('lastSync_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      showToast('All synced results cleared', 'success');
    } catch (error) {
      console.error('Failed to clear synced results:', error);
      showToast('Failed to clear synced results', 'error');
    }
    setConfirmDialog({ isOpen: false, type: null });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-lucky-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-lucky-primary" />
          <h1 className="text-3xl font-bold text-lucky-text dark:text-lucky-dark-text">
            Settings
          </h1>
        </div>
        <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted">
          Customize your LuckyLens experience
        </p>
      </div>

      {/* Appearance Section */}
      <section className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-lucky-primary" />
          <h2 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text">
            Appearance
          </h2>
        </div>
        
        <div className="space-y-4">
          <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
            Dark Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${theme === 'light'
                  ? 'border-lucky-primary bg-lucky-primary/5 dark:bg-lucky-primary/10'
                  : 'border-lucky-border dark:border-lucky-dark-border hover:border-lucky-primary/50'
                }
              `}
            >
              <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-lucky-primary' : 'text-lucky-text-muted'}`} />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-lucky-text dark:text-lucky-dark-text' : 'text-lucky-text-muted'}`}>
                Light
              </span>
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${theme === 'dark'
                  ? 'border-lucky-primary bg-lucky-primary/5 dark:bg-lucky-primary/10'
                  : 'border-lucky-border dark:border-lucky-dark-border hover:border-lucky-primary/50'
                }
              `}
            >
              <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-lucky-primary' : 'text-lucky-text-muted'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-lucky-text dark:text-lucky-dark-text' : 'text-lucky-text-muted'}`}>
                Dark
              </span>
            </button>
            
            <button
              onClick={() => handleThemeChange('system')}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${theme === 'system'
                  ? 'border-lucky-primary bg-lucky-primary/5 dark:bg-lucky-primary/10'
                  : 'border-lucky-border dark:border-lucky-dark-border hover:border-lucky-primary/50'
                }
              `}
            >
              <Monitor className={`w-6 h-6 ${theme === 'system' ? 'text-lucky-primary' : 'text-lucky-text-muted'}`} />
              <span className={`text-sm font-medium ${theme === 'system' ? 'text-lucky-text dark:text-lucky-dark-text' : 'text-lucky-text-muted'}`}>
                System
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Generation Preferences Section */}
      <section className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-lucky-secondary" />
          <h2 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text">
            Generation Preferences
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Default Game */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
              Default Game
            </label>
            <GameSelector 
              selectedGame={defaultGame}
              onSelectGame={handleDefaultGameChange}
            />
          </div>

          {/* Default Set Count */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
              Default Set Count
            </label>
            <SetCountSelector 
              value={settings?.defaultSetCount || 1}
              onChange={handleSetCountChange}
            />
            <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
              How many number sets to generate by default
            </p>
          </div>

          {/* No Repeat Toggle */}
          <Toggle
            checked={settings?.noRepeat || false}
            onChange={handleNoRepeatChange}
            label="No Repeat"
            description="When enabled, generated numbers won't repeat your last saved set or duplicate within a batch."
          />
        </div>
      </section>

      {/* Data Management Section */}
      <section className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-lucky-error" />
          <h2 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text">
            Data Management
          </h2>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => openConfirmDialog('saved')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-lucky-border dark:border-lucky-dark-border hover:border-lucky-error/50 hover:bg-lucky-error/5 transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-lucky-text dark:text-lucky-dark-text">
                Clear All Saved Numbers
              </p>
              <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
                Delete all your saved number sets
              </p>
            </div>
            <Trash2 className="w-5 h-5 text-lucky-error" />
          </button>

          <button
            onClick={() => openConfirmDialog('synced')}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-lucky-border dark:border-lucky-dark-border hover:border-lucky-error/50 hover:bg-lucky-error/5 transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-lucky-text dark:text-lucky-dark-text">
                Clear Synced Results
              </p>
              <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
                Delete all cached winning numbers
              </p>
            </div>
            <Trash2 className="w-5 h-5 text-lucky-error" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-lucky-primary" />
          <h2 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text">
            About LuckyLens
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-lucky-text-muted dark:text-lucky-dark-text-muted">Version</span>
            <span className="font-medium text-lucky-text dark:text-lucky-dark-text">1.0.0</span>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              LuckyLens is a free entertainment app. It does not sell lottery tickets, predict outcomes, 
              or guarantee winnings in any way. Lottery games involve risk. Please play responsibly. 
              This app is not affiliated with, endorsed by, or connected to any state lottery commission 
              or lottery organization.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/terms"
              className="inline-flex items-center gap-1 text-sm text-lucky-primary hover:underline"
            >
              Terms of Service
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1 text-sm text-lucky-primary hover:underline"
            >
              Privacy Policy
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted pt-2">
            Built with Next.js, TypeScript, Tailwind CSS
          </p>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'saved' ? 'Clear All Saved Numbers?' : 'Clear Synced Results?'}
        message={
          confirmDialog.type === 'saved'
            ? 'Delete all saved number sets? This cannot be undone.'
            : 'Delete all cached winning numbers? You can re-sync anytime.'
        }
        confirmLabel="Clear"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDialog.type === 'saved' ? handleClearSavedNumbers : handleClearSyncedResults}
        onCancel={() => setConfirmDialog({ isOpen: false, type: null })}
      />
    </div>
  );
}
