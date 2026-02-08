'use client';

import { useEffect, useState } from 'react';

interface UseDBAvailableResult {
  isAvailable: boolean;
  isChecking: boolean;
}

/**
 * Hook to check if IndexedDB is available
 * Some browsers/users disable storage or run in private mode
 */
export function useDBAvailable(): UseDBAvailableResult {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkDBAvailability() {
      try {
        // Try to open a test database
        const testDB = indexedDB.open('__luckylens_test__');
        
        await new Promise<void>((resolve, reject) => {
          testDB.onsuccess = () => {
            // Close and delete the test database
            testDB.result.close();
            indexedDB.deleteDatabase('__luckylens_test__');
            resolve();
          };
          testDB.onerror = () => reject(new Error('IndexedDB error'));
          testDB.onblocked = () => reject(new Error('IndexedDB blocked'));
        });

        setIsAvailable(true);
      } catch (error) {
        console.warn('IndexedDB not available:', error);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkDBAvailability();
  }, []);

  return { isAvailable, isChecking };
}
