// components/Header.tsx
'use client';
import { useHasHydrated } from '@/app/hooks/useHasHydrated';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import CartDropdown from './Cart';
import { clearUser } from '@/lib/slices/authSlice';
import type { RootState, AppDispatch } from '@/lib/store';

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hydrated = useHasHydrated();

  // Auth state from Redux
  const { userId, name } = useSelector((s: RootState) => s.auth);

  // Dropdown open state
  const [open, setOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [open]);

  function handleSignOut() {
    dispatch(clearUser());
    router.push('/');
  }
  if (!hydrated) {
    // prevents flicker
    return (
      <header className="pt-5 p-4 h-6 bg-amber-700 text-black flex justify-between">
        <span className="text-2xl font-bold">Whisker 🐾</span>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between p-4 bg-amber-700 text-black">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold">
          Whisker 🐾
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/blog">Blog</Link>
          <Link href="/shop">Shop</Link>
          <CartDropdown />
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {userId ? (
          // Profile dropdown when logged in
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="hidden sm:inline text-sm font-medium">{name}</span>
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50">
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/payments"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Payment
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login link when not logged in
          <Link
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
}
