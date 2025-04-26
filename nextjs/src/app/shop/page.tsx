"use client";

import { ShoppingPage } from "@/components/ShoppingPage";
import { products as initialProducts } from "@/lib/data/products";
import { useState } from "react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [filters, setFilters] = useState<any[]>([
    {
      id: "toys",
      name: "Toys",
      checked: false,
    },
    {
      id: "care",
      name: "Care",
      checked: false,
    },
    {
      id: "food",
      name: "Food",
      checked: false,
    },
  ]);

  const onSetFilters = (filterId: string) => {
    const updatedFilters = filters.map((f) =>
      f.id === filterId ? { ...f, checked: !f.checked } : f
    );

    setFilters(updatedFilters);

    const selectedCategories = updatedFilters
      .filter((f) => f.checked)
      .map((f) => f.id);

    const filteredProducts = selectedCategories.length
      ? initialProducts.filter((product) =>
          selectedCategories.includes(product.category.toLowerCase())
        )
      : initialProducts;

    setProducts(filteredProducts);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-2 md:col-span-1">
          <ShoppingPage.Filters filters={filters} onSetFilters={onSetFilters} />
        </div>
        <div className="p-2 md:col-span-3">
          <ShoppingPage.Products products={products} />
        </div>
      </div>
    </div>
  );
}
