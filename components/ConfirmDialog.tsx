'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation Dialog Component
 * Used for destructive actions that require user confirmation
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmClasses = confirmVariant === 'danger'
    ? 'bg-lucky-error hover:bg-red-600'
    : 'bg-lucky-primary hover:bg-lucky-primary-hover';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-2xl border border-lucky-border dark:border-lucky-dark-border max-w-md w-full p-6 shadow-xl animate-fade-in">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            confirmVariant === 'danger' 
              ? 'bg-lucky-error/10 dark:bg-lucky-error/20' 
              : 'bg-lucky-primary/10 dark:bg-lucky-primary/20'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              confirmVariant === 'danger' 
                ? 'text-lucky-error' 
                : 'text-lucky-primary'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-lucky-text dark:text-lucky-dark-text mb-2">
              {title}
            </h3>
            <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-lucky-border dark:border-lucky-dark-border text-lucky-text dark:text-lucky-dark-text font-medium hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
