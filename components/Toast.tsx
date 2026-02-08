'use client';

import { useToast } from '@/hooks/useToast';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-lucky-success/10 dark:bg-lucky-success/20 text-lucky-success border-lucky-success/20',
  error: 'bg-lucky-error/10 dark:bg-lucky-error/20 text-lucky-error border-lucky-error/20',
  info: 'bg-lucky-info/10 dark:bg-lucky-info/20 text-lucky-info border-lucky-info/20',
};

export function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              border shadow-lg backdrop-blur-sm
              animate-slide-up
              ${colorMap[toast.type]}
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
