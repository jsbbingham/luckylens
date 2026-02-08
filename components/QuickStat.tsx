interface QuickStatProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export function QuickStat({ label, value, icon }: QuickStatProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-lucky-surface dark:bg-lucky-dark-surface rounded-lg border border-lucky-border dark:border-lucky-dark-border">
      {icon && (
        <div className="text-lucky-primary dark:text-lucky-primary">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted uppercase tracking-wide">
          {label}
        </p>
        <p className="font-semibold text-lucky-text dark:text-lucky-dark-text">
          {value}
        </p>
      </div>
    </div>
  );
}
