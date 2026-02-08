'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { ToastProvider } from '@/hooks/useToast';
import { ClientLayout } from '@/components/ClientLayout';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}
