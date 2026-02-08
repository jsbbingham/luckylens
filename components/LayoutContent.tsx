'use client';

import { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useDBAvailable } from '@/hooks/useDBAvailable';
import { AlertCircle } from 'lucide-react';

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAvailable: isDBAvailable, isChecking: isCheckingDB } = useDBAvailable();

  return (
    <div className="min-h-screen bg-lucky-background dark:bg-lucky-dark-background">
      {/* DB Unavailable Banner */}
      {!isCheckingDB && !isDBAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Local storage is unavailable. Your data won&apos;t be saved between sessions.</span>
          </div>
        </div>
      )}

      <ErrorBoundary>
        {/* Header would go here - but this is a client component wrapper */}
        <main className={!isCheckingDB && !isDBAvailable ? 'pt-8' : ''}>
          {children}
        </main>
      </ErrorBoundary>
    </div>
  );
}
