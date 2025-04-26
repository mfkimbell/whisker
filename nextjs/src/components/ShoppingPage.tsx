import { Product } from "./Product";

const Filters = ({
  filters,
  onSetFilters,
}: {
  filters: any[];
  onSetFilters: (id: string) => void;
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-fit">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Filters</h3>
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Category</h3>
        <div className="space-y-2">
          {filters.map((filter) => (
            <div key={filter.id} className="group">
              <label
                htmlFor={filter.id}
                className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id={filter.id}
                    checked={filter.checked}
                    onChange={() => onSetFilters(filter.id)}
                    className="appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:border-orange-500 checked:bg-orange-500 transition-colors"
                  />
                  {filter.checked && (
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`${
                    filter.checked
                      ? "text-gray-900 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {filter.name}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Products = ({ products }: { products: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export const ShoppingPage = { Filters, Products };
