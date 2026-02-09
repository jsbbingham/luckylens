'use client';

import Link from 'next/link';
import { Home, Dices, Hand, History, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Dices, label: 'Generate', href: '/generate' },
  { icon: Hand, label: 'Self-Pick', href: '/self-pick' },
  { icon: History, label: 'History', href: '/history' },
  { icon: BarChart3, label: 'Trends', href: '/trends' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-lucky-surface dark:bg-lucky-dark-surface border-t border-lucky-border dark:border-lucky-dark-border lg:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 flex-1 h-full
                transition-colors duration-200
                ${isActive
                  ? 'text-lucky-primary dark:text-lucky-primary'
                  : 'text-lucky-text-muted dark:text-lucky-dark-text-muted hover:text-lucky-text dark:hover:text-lucky-dark-text'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
