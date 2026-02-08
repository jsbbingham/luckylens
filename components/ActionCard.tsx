import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: 'primary' | 'secondary' | 'accent';
}

const colorClasses = {
  primary: {
    bg: 'bg-lucky-primary/10 dark:bg-lucky-primary/20',
    bgHover: 'hover:bg-lucky-primary/20 dark:hover:bg-lucky-primary/30',
    border: 'border-lucky-primary/30 dark:border-lucky-primary/40',
    borderHover: 'hover:border-lucky-primary/50 dark:hover:border-lucky-primary/60',
    icon: 'bg-lucky-primary text-white',
  },
  secondary: {
    bg: 'bg-lucky-secondary/10 dark:bg-lucky-secondary/20',
    bgHover: 'hover:bg-lucky-secondary/20 dark:hover:bg-lucky-secondary/30',
    border: 'border-lucky-secondary/30 dark:border-lucky-secondary/40',
    borderHover: 'hover:border-lucky-secondary/50 dark:hover:border-lucky-secondary/60',
    icon: 'bg-lucky-secondary text-white',
  },
  accent: {
    bg: 'bg-lucky-accent/10 dark:bg-lucky-accent/20',
    bgHover: 'hover:bg-lucky-accent/20 dark:hover:bg-lucky-accent/30',
    border: 'border-lucky-accent/30 dark:border-lucky-accent/40',
    borderHover: 'hover:border-lucky-accent/50 dark:hover:border-lucky-accent/60',
    icon: 'bg-lucky-accent text-white',
  },
};

export function ActionCard({ title, description, icon: Icon, href, color }: ActionCardProps) {
  const colors = colorClasses[color];

  return (
    <Link
      href={href}
      className={`
        block p-5 rounded-xl
        ${colors.bg} ${colors.bgHover}
        border-2 ${colors.border} ${colors.borderHover}
        transition-all duration-200
        group
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${colors.icon}
          shadow-lg group-hover:scale-110 transition-transform duration-200
        `}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text mb-1">
            {title}
          </h3>
          <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
