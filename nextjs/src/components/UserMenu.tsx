'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/lib/slices/authSlice';
import type { RootState, AppDispatch } from '@/lib/store';

export default function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { name } = useSelector((s: RootState) => s.auth);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  function handleSignOut() {
    dispatch(clearUser());
    document.cookie = 'userId=; Max-Age=0; path=/';
    document.cookie = 'name=; Max-Age=0; path=/';
    router.push('/');
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
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
  );
}
