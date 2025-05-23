"use client";

import { useHasHydrated } from "@/app/hooks/useHasHydrated";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import CartDropdown from "./Cart";
import { clearUser } from "@/lib/slices/authSlice";
import type { RootState, AppDispatch } from "@/lib/store";
import Image from "next/image";
import { SidebarTrigger } from "./ui/sidebar";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hydrated = useHasHydrated();
  const { userId, name } = useSelector((s: RootState) => s.auth);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [open]);

  function handleSignOut() {
    dispatch(clearUser());
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between p-4 bg-[#E77818] text-black">
      {/* Left: Logo + Nav */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            src="/whisker_white.svg"
            alt="Whisker Logo"
            width={140}
            height={40}
          />
        </Link>
      </div>

      {/* Right: Auth state (hydrated only) */}
      <div className="flex items-center space-x-4">
        <nav className="flex items-center space-x-4">
          <Link href="/shop" className="text-white flex items-center">
            <ShoppingBag />
            <span className="ml-2">Shop</span>
          </Link>
          <CartDropdown />
        </nav>

        <div className="flex items-center">
          <SidebarTrigger className="text-white"> </SidebarTrigger>
          <span className="ml-2 text-white">View Analytics</span>
        </div>

        {!hydrated ? null : userId ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              
              <div className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center">
                {name ? name.charAt(0).toUpperCase() : "U"}
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
          <Link
            href="/signup"
            className="bg-[#2F59D5] text-white px-4 py-2 rounded hover:bg-blue-800 transition cursor-pointer"
          >
            Sign Up
          </Link>
        )}
      </div>
    </header>
  );
}
