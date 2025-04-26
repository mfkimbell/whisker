"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { removeItem, markAbandonedTracked } from "@/lib/slices/cartSlice";
import { analytics } from "@/lib/segment";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function CartDropdown() {
  const items = useSelector((s: RootState) => s.cart.items);
  const abandonedTracked = useSelector(
    (s: RootState) => s.cart.abandonedTracked
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 30s abandonment tracking (as before)
  useEffect(() => {
    if (items.length > 0 && !abandonedTracked) {
      const timer = setTimeout(() => {
        analytics.track("Cart Abandoned", { items });
        dispatch(markAbandonedTracked());
      }, 30_000);
      return () => clearTimeout(timer);
    }
  }, [items, abandonedTracked, dispatch]);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
       
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 cursor-pointer"
        aria-label="Toggle cart"
      >
        <ShoppingCart size={20} className="text-white" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1 text-xs">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-lg p-4 z-50">
          <h4 className="font-semibold mb-2">Your Cart</h4>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-auto">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>
                    {item.name} — ${item.price}
                  </span>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {items.length > 0 && (
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => router.push("/checkout")}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Checkout
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="underline text-sm text-gray-600"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
