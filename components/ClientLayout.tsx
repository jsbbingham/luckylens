'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { Toast } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PWALifecycle } from '@/components/PWALifecycle';
import { useDBAvailable } from '@/hooks/useDBAvailable';
import { AlertCircle } from 'lucide-react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAvailable: isDBAvailable, isChecking: isCheckingDB } = useDBAvailable();
  const showDBWarning = !isCheckingDB && !isDBAvailable;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-lucky-background dark:bg-lucky-dark-background">
        {/* DB Unavailable Banner */}
        {showDBWarning && (
          <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-white px-4 py-2 text-center text-sm shadow-md">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Local storage is unavailable. Your data won&apos;t be saved between sessions.</span>
            </div>
          </div>
        )}

        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className={`flex ${showDBWarning ? 'pt-[72px]' : 'pt-16'}`}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          
          <main className="flex-1 lg:ml-64 p-4 pb-24 lg:pb-4">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        <BottomNav />
        <Toast />
        <PWALifecycle />
      </div>
    </ErrorBoundary>
  );
}
