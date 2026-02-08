'use client';

interface SetCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

/**
 * Set Count Selector Component
 * Allows users to select how many number sets to generate (1-5)
 */
export function SetCountSelector({ 
  value, 
  onChange, 
  min = 1, 
  max = 5 
}: SetCountSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((count) => (
        <button
          key={count}
          onClick={() => onChange(count)}
          className={`
            w-12 h-12 rounded-xl font-semibold text-lg transition-all duration-200
            ${value === count
              ? 'bg-gradient-to-br from-lucky-primary to-lucky-secondary text-white shadow-lg scale-105'
              : 'bg-lucky-surface dark:bg-lucky-dark-surface border border-lucky-border dark:border-lucky-dark-border text-lucky-text dark:text-lucky-dark-text hover:border-lucky-primary dark:hover:border-lucky-primary'
            }
          `}
        >
          {count}
        </button>
      ))}
    </div>
  );
}
