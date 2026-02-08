'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * Catches rendering errors and displays a friendly UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-lucky-background dark:bg-lucky-dark-background">
          <div className="text-center space-y-6 p-8 bg-lucky-surface dark:bg-lucky-dark-surface rounded-2xl border border-lucky-border dark:border-lucky-dark-border max-w-md w-full">
            <div className="w-20 h-20 mx-auto rounded-full bg-lucky-error/10 dark:bg-lucky-error/20 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-lucky-error" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-lucky-text dark:text-lucky-dark-text">
              Something went wrong
            </h1>
            <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lucky-primary text-white font-medium hover:bg-lucky-primary-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
