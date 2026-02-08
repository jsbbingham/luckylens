'use client';

import { useMemo } from 'react';

interface NumberGridProps {
  min: number;
  max: number;
  maxSelections: number;
  selectedNumbers: number[];
  onToggle: (num: number) => void;
  ballColor: string;
  disabled?: boolean;
  label?: string;
}

export function NumberGrid({
  min,
  max,
  maxSelections,
  selectedNumbers,
  onToggle,
  ballColor,
  disabled = false,
  label,
}: NumberGridProps) {
  const isMaxReached = selectedNumbers.length >= maxSelections;
  
  // Generate array of numbers from min to max
  const numbers = useMemo(() => {
    const arr: number[] = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }, [min, max]);

  const handleToggle = (num: number) => {
    if (disabled) return;
    
    const isSelected = selectedNumbers.includes(num);
    
    if (isSelected) {
      // Always allow deselecting
      onToggle(num);
    } else if (!isMaxReached) {
      // Only allow selecting if not at max
      onToggle(num);
    }
  };

  // Calculate progress percentage
  const progressPercent = (selectedNumbers.length / maxSelections) * 100;

  return (
    <div className="space-y-3">
      {/* Label and count */}
      {(label || maxSelections > 1) && (
        <div className="space-y-1">
          {label && (
            <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
              {label}
            </label>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
              {selectedNumbers.length} of {maxSelections} selected
            </span>
            <div className="flex-1 h-1 bg-lucky-border dark:bg-lucky-dark-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-lucky-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Number grid */}
      <div className="grid grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {numbers.map((num) => {
          const isSelected = selectedNumbers.includes(num);
          const isDisabled = disabled || (!isSelected && isMaxReached);

          // Format number with leading zero for single digits
          const displayNum = num < 10 ? `0${num}` : num.toString();

          return (
            <button
              key={num}
              onClick={() => handleToggle(num)}
              disabled={isDisabled}
              className={`
                w-11 h-11 sm:w-12 sm:h-12 rounded-full
                flex items-center justify-center
                text-sm font-semibold
                transition-all duration-200
                min-w-[44px] min-h-[44px]
                ${isSelected
                  ? `${ballColor} text-white shadow-lg scale-110`
                  : 'bg-lucky-surface dark:bg-lucky-dark-surface text-lucky-text dark:text-lucky-dark-text border-2 border-lucky-border dark:border-lucky-dark-border hover:border-lucky-primary dark:hover:border-lucky-primary'
                }
                ${isDisabled && !isSelected
                  ? 'opacity-40 cursor-not-allowed pointer-events-none'
                  : 'cursor-pointer'
                }
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
              aria-pressed={isSelected}
              aria-label={`Number ${num}${isSelected ? ', selected' : ''}${isDisabled && !isSelected ? ', disabled' : ''}`}
            >
              {displayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
