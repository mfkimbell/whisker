// app/product/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { analytics } from "@/lib/segment";
import { useDispatch } from "react-redux";
import { addItem } from "@/lib/slices/cartSlice";
import { AppDispatch } from "@/lib/store";
import { products } from "@/lib/data/products";
import { ProductPage as ProductPageComponent } from "@/components/ProductPage";

export default function ProductPage() {
  const { id } = useParams();
  const idStr = Array.isArray(id) ? id[0] : id ?? "unknown";
  const product = products.find((p) => p.id === idStr);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (product) {
      analytics.track("Viewed Product", {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
      });
    }
  }, [product?.id]);

  function handleAddToCart() {
    if (!product) return;
    analytics.track("Added to Cart", {
      productId: product.id,
      name: product.name,
      price: product.price,
    });

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );
  }

  if (!product) return <p>Loading…</p>;

  return (
    <div className="h-full mx-2 px-4 py-8">
      <div className="flex gap-8 h-full">
        <ProductPageComponent.ProductImage path={product.image} />
        <div className="w-full h-full">
          <ProductPageComponent.ProductInformation product={product} />
          <ProductPageComponent.ProductActions onAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
}
