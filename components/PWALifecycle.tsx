'use client';

import { useServiceWorker } from '@/hooks/useServiceWorker';
import { RefreshCw, X } from 'lucide-react';

/**
 * PWA Lifecycle Component
 * Handles service worker registration and update prompts
 */
export function PWALifecycle() {
  const { isRegistered, isUpdateAvailable, update, error } = useServiceWorker();

  // Don't show anything if not registered or no update available
  if (!isRegistered || !isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl shadow-lg border border-lucky-border dark:border-lucky-dark-border p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-lucky-primary/10 dark:bg-lucky-primary/20 flex items-center justify-center shrink-0">
          <RefreshCw className="w-5 h-5 text-lucky-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text text-sm">
            Update Available
          </h3>
          <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted mt-1">
            A new version of LuckyLens is available with improvements and bug fixes.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={update}
              className="flex-1 px-3 py-2 rounded-lg bg-lucky-primary text-white text-sm font-medium hover:bg-lucky-primary-hover transition-colors"
            >
              Update Now
            </button>
            <button
              onClick={() => {}} // Dismiss without updating
              className="px-3 py-2 rounded-lg border border-lucky-border dark:border-lucky-dark-border text-lucky-text dark:text-lucky-dark-text text-sm hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
