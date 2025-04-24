'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { setUser } from '@/lib/slices/authSlice';
import type { RootState } from '@/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  const store = storeRef.current;

  useEffect(() => {
    // 1) Hydrate from localStorage on client mount
    const storedId = localStorage.getItem('userId');
    const storedPhone = localStorage.getItem('phone');
    const storedName = localStorage.getItem('name');
    if (storedId && storedPhone && storedName) {
      console.log('Grabbing User from Local Storage');
      store.dispatch(setUser({ userId: storedId, phone: storedPhone, name: storedName }));
    }

    // 2) Subscribe to save auth state on every change
    const unsubscribe = store.subscribe(() => {
      const { userId, phone, name } = (store.getState() as RootState).auth;

      if (userId || phone || name) {
        // save only if there's something to save
        if (userId) localStorage.setItem('userId', userId);
        else localStorage.removeItem('userId');

        if (phone) localStorage.setItem('phone', phone);
        else localStorage.removeItem('phone');

        if (name) localStorage.setItem('name', name);
        else localStorage.removeItem('name');
      } else {
        // truly logged out: both are gone
        localStorage.removeItem('userId');
        localStorage.removeItem('phone');
        console.log('Removing local storage'); // ✅ This will now show up
      }
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
