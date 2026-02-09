'use client';

import { AlertTriangle } from 'lucide-react';

interface DemoDataWarningProps {
  gameName: string;
}

export function DemoDataWarning({ gameName }: DemoDataWarningProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
          Using Sample Data
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Live sync is not available for {gameName}. The results shown are sample data for demonstration purposes only.
          Always verify official results before playing.
        </p>
      </div>
    </div>
  );
}
