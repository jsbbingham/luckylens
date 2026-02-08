'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseServiceWorkerResult {
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  update: () => void;
  error: Error | null;
}

/**
 * Hook to register and manage the Service Worker
 * Enables PWA offline functionality
 */
export function useServiceWorker(): UseServiceWorkerResult {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let isMounted = true;

    async function registerSW() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        if (!isMounted) return;

        console.log('[PWA] Service Worker registered:', registration.scope);
        setIsRegistered(true);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                console.log('[PWA] Update available');
                setIsUpdateAvailable(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });

        // Check if already waiting
        if (registration.waiting) {
          setIsUpdateAvailable(true);
          setWaitingWorker(registration.waiting);
        }

      } catch (err) {
        console.error('[PWA] Service Worker registration failed:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('SW registration failed'));
        }
      }
    }

    registerSW();

    return () => {
      isMounted = false;
    };
  }, []);

  const update = useCallback(() => {
    if (waitingWorker) {
      // Tell the waiting worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate the new worker
      window.location.reload();
    }
  }, [waitingWorker]);

  return {
    isRegistered,
    isUpdateAvailable,
    update,
    error,
  };
}
