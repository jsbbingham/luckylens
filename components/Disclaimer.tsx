import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'full' | 'compact';
}

export function Disclaimer({ variant = 'full' }: DisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 p-2 bg-lucky-info/10 dark:bg-lucky-info/20 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-lucky-info flex-shrink-0" />
        <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
          For entertainment only. Not affiliated with official lotteries.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-lucky-info/10 dark:bg-lucky-info/20 border border-lucky-info/20 dark:border-lucky-info/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-lucky-info flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-lucky-text dark:text-lucky-dark-text">
            <strong>Entertainment Purpose Only:</strong> LuckyLens is a fun tool for generating lottery number combinations. 
            It does not guarantee winning and is not affiliated with any official lottery organization.
          </p>
          <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
            Please play responsibly. If you or someone you know has a gambling problem, call 1-800-522-4700 (National Council on Problem Gambling).
          </p>
        </div>
      </div>
    </div>
  );
}
