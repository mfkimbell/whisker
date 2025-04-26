import Image from "next/image";

const ProductImage = ({ path }: { path: string }) => {
  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      <Image
        src={path}
        alt="Product"
        height={750}
        width={750}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-4"
        priority
      />
    </div>
  );
};

const ProductInformation = ({
  product,
}: {
  product: {
    id: string;
    brand: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    ratingCount: number;
    badge?: string;
    isDeal?: boolean;
    promo?: string;
  };
}) => {
  return (
    <div className="space-y-4 w-full">
      {(product.isDeal || product.badge) && (
        <div className="flex space-x-2">
          {product.isDeal && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              Deal
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
              {product.badge}
            </span>
          )}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-gray-500 font-medium">{product.brand}</p>
        <h1 className="text-2xl font-bold">{product.name}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          {product.rating % 1 >= 0.5 && (
            <div className="relative -ml-4">
              <svg
                className="w-4 h-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: "50%" }}
              >
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500">
          ({product.ratingCount.toLocaleString()})
        </span>
      </div>
      <div className="flex items-end space-x-2 mt-4">
        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-lg text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        {product.originalPrice && (
          <span className="text-sm font-semibold text-green-600">
            Save ${(product.originalPrice - product.price).toFixed(2)}
          </span>
        )}
      </div>
      {product.promo && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p
            className="text-sm text-blue-800"
            dangerouslySetInnerHTML={{ __html: product.promo }}
          />
        </div>
      )}
      <p className="text-sm text-gray-500">Category: {product.category}</p>
    </div>
  );
};

const ProductActions = ({ onAddToCart }: { onAddToCart: () => void }) => {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
        <button
          onClick={onAddToCart}
          className="flex-1 px-6 py-3 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
      <div className="flex items-center justify-between border-t border-b py-3">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="text-sm text-gray-600">
            Free shipping on orders over $35
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            ></path>
          </svg>
          <span className="text-sm text-gray-600">Secure payment</span>
        </div>
      </div>
    </div>
  );
};

export const ProductPage = { ProductImage, ProductInformation, ProductActions };
