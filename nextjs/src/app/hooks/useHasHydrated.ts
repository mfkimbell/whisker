// hooks/useHasHydrated.ts
//wait until page has hydrated to interact with redux (for user info)
import { useState, useEffect } from 'react';

export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
