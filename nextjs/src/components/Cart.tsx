"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { removeItem } from "@/lib/slices/cartSlice";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CartDropdown() {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="relative p-2 cursor-pointer flex items-center"
        aria-label="Toggle cart"
      >
        <ShoppingCart size={20} className="text-white relative" />
        <span className="ml-2 text-white">View Cart</span>
        {items.length > 0 && (
          <span className="absolute top-1 right-21 bg-red-600 text-white rounded-full px-1 text-xs">
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
            <>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {items.map((item, index) => (
                  <li
                    key={item.id + index}
                    className="flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          <span className="max-w-[175px] truncate">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            ${item.price}
                          </span>
                        </div>
                        <button
                          onClick={() => dispatch(removeItem(item.id))}
                          className="text-red-500 hover:underline text-sm text-left cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <hr className="my-2 border-t border-black" />

              <div className="flex justify-between">
                <p className="text-sm text-gray-500">
                  Total: $
                  {items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                </p>
              </div>
            </>
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
                onClick={() => {
                  router.push("/shop");
                  setOpen(false);
                }}
                className="underline text-sm text-gray-600 cursor-pointer"
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
