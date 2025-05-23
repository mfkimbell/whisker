'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { setUser } from '@/lib/slices/authSlice';
import type { RootState } from '@/lib/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  const store = storeRef.current;

  useEffect(() => {
    // Hydrate from localStorage
    const storedId = localStorage.getItem('userId');
    const storedPhone = localStorage.getItem('phone');
    const storedName = localStorage.getItem('name');
    const storedConversationId = localStorage.getItem('conversationId');

    if (storedId && storedPhone && storedName) {
      console.log('Grabbing User from Local Storage');
      store.dispatch(
        setUser({
          userId: storedId,
          phone: storedPhone,
          name: storedName,
          conversationId: storedConversationId ?? undefined,
        }),
      );
    }

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      const { userId, phone, name, conversationId } = (store.getState() as RootState).auth;

      if (userId || phone || name || conversationId) {
        if (userId) {
          localStorage.setItem('userId', userId);
        } else {
          localStorage.removeItem('userId');
        }

        if (phone) {
          localStorage.setItem('phone', phone);
        } else {
          localStorage.removeItem('phone');
        }

        if (name) {
          localStorage.setItem('name', name);
        } else {
          localStorage.removeItem('name');
        }

        if (conversationId) {
          localStorage.setItem('conversationId', conversationId);
        } else {
          localStorage.removeItem('conversationId');
        }
      } else {
        localStorage.removeItem('userId');
        localStorage.removeItem('phone');
        localStorage.removeItem('name');
        localStorage.removeItem('conversationId');
        console.log('Removing local storage');
      }
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
