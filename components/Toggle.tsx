'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

/**
 * Toggle/Switch Component
 * A clean toggle switch for boolean settings
 */
export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lucky-primary focus:ring-offset-2 dark:focus:ring-offset-lucky-dark-surface
          ${checked ? 'bg-lucky-primary' : 'bg-lucky-border dark:bg-lucky-dark-border'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
