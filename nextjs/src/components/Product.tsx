import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { analytics } from "@/lib/segment";
import { addItem } from "@/lib/slices/cartSlice";
import { toast } from "react-toastify";

export type ProductProps = {
  product: {
    id: string;
    brand: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    ratingCount: number;
    badge: string | null;
    isDeal?: boolean;
    promo: string | null;
    image: string;
  };
};

export const Product = ({ product }: ProductProps) => {
  const dispatch = useDispatch<AppDispatch>();

  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
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

    toast.success(`Added ${product.name} to Cart`, { autoClose: 3500 });
  }

  return (
    <Link key={product.id} href={`/product/${product.id}`}>
      <div className="relative flex flex-col rounded-xl border bg-white shadow-sm hover:shadow-lg transition">
        {/* badge (e.g. “Deal”) */}
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 rounded bg-rose-700 px-2 py-0.5 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}

        {/* product image */}
        <div className="relative h-64 p-6">
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            layout="fill"
            className="object-contain p-6"
            sizes="(max-width: 1024px) 50vw, 25vw"
            priority
          />
        </div>

        {/* details */}
        <div className="p-5 space-y-2 flex flex-col flex-grow">
          {/* brand + name */}
          <h3 className="text-sm font-semibold leading-snug clamp-2">
            {product.brand} <span className="font-normal">{product.name}</span>
          </h3>

          {/* category */}
          <p className="text-xs text-gray-500">Category: {product.category}</p>

          {/* rating */}
          {product.rating && (
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((n) => (
                <svg
                  key={n}
                  className="h-4 w-4"
                  fill={n <= product.rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.054 5.882 1.473 8.312L12 18.896l-7.419 4.604 1.473-8.312L0 9.306l8.332-1.151z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-600">
                {product.rating.toFixed(1)}
                {product.ratingCount && (
                  <span className="text-gray-400 font-medium">
                    {" "}
                    ({product.ratingCount})
                  </span>
                )}
              </span>
            </div>
          )}

          {/* price block */}
          <div className="space-y-0.5">
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-rose-700">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm line-through text-gray-400">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* spacer pushes button to bottom if card height varies */}
          <div className="flex-grow" />

          {/* add to cart */}
          <button
            className="w-full rounded-full bg-amber-600 py-2 text-sm font-medium text-white transition hover:bg-amber-700 cursor-pointer"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};
