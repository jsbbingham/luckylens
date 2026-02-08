'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-200
        ${isScrolled 
          ? 'bg-lucky-surface/95 dark:bg-lucky-dark-surface/95 backdrop-blur-sm shadow-lg' 
          : 'bg-lucky-surface dark:bg-lucky-dark-surface'
        }
        border-b border-lucky-border dark:border-lucky-dark-border
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-lucky-text dark:text-lucky-dark-text" />
              ) : (
                <Menu className="w-6 h-6 text-lucky-text dark:text-lucky-dark-text" />
              )}
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} animated={false} />
              <span className="text-xl font-bold bg-gradient-to-r from-lucky-primary to-lucky-secondary bg-clip-text text-transparent">
                LuckyLens
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
