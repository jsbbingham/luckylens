'use client';

import Link from 'next/link';
import { Home, Dices, Hand, History, BarChart3, Settings, FileText, Shield, Trophy } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Dices, label: 'Generate Numbers', href: '/generate' },
  { icon: Hand, label: 'Self-Pick', href: '/self-pick' },
  { icon: History, label: 'History', href: '/history' },
  { icon: BarChart3, label: 'Trends', href: '/trends' },
  { icon: Trophy, label: 'Results', href: '/results' },
];

const secondaryNavItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: FileText, label: 'Terms', href: '/terms' },
  { icon: Shield, label: 'Privacy', href: '/privacy' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const NavItem = ({ icon: Icon, label, href }: { icon: typeof Home; label: string; href: string }) => {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-200
          ${isActive
            ? 'bg-lucky-primary/10 dark:bg-lucky-primary/20 text-lucky-primary dark:text-lucky-primary font-medium'
            : 'text-lucky-text dark:text-lucky-dark-text hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover'
          }
        `}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 w-64 z-50
          bg-lucky-surface dark:bg-lucky-dark-surface-elevated
          border-r border-lucky-border dark:border-lucky-dark-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto
        `}
      >
        <div className="p-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-lucky-text-muted dark:text-lucky-dark-text-muted uppercase tracking-wider">
            Main
          </p>
          {mainNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <div className="border-t border-lucky-border dark:border-lucky-dark-border my-4" />

        <div className="p-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-lucky-text-muted dark:text-lucky-dark-text-muted uppercase tracking-wider">
            Other
          </p>
          {secondaryNavItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </aside>
    </>
  );
}
