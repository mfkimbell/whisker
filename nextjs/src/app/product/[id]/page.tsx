// app/product/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/lib/segment';
import { useDispatch } from 'react-redux';
import { addItem } from '@/lib/slices/cartSlice';
import { AppDispatch } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

// Mock catalog
const catalog: Record<string, any> = {
  prod1: { id: 'prod1', name: 'Kitten Starter Kit', category: 'Care', price: 49 },
  prod2: { id: 'prod2', name: 'Auto Feeder Pro', category: 'Care', price: 149 },
};

export default function ProductPage() {
  const { id } = useParams();
  const idStr = Array.isArray(id) ? id[0] : (id ?? 'unknown');
  const product = catalog[idStr];
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (product) {
      analytics.track('Viewed Product', {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
      });
    }
  }, [product?.id]);

  function handleAddToCart() {
    if (!product) return;
    analytics.track('Added to Cart', {
      productId: product.id,
      name: product.name,
      price: product.price,
    });
    dispatch(addItem(product));
  }

  function handleBuyNow() {
    if (!product) return;
    const orderId = uuidv4();
    analytics.track('Purchase Completed', {
      orderId,
      orderValue: product.price,
      items: [{ productId: product.id, name: product.name, price: product.price, quantity: 1 }],
    });
    // Optionally: show a confirmation or navigate
    alert(`🎉 Purchased ${product.name} for $${product.price}! (order ${orderId})`);
  }

  if (!product) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-lg">${product.price.toFixed(2)}</p>

      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
