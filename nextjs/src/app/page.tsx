"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { analytics } from "@/lib/segment";
import Image from "next/image";

export default function HomePage() {
  useEffect(() => {
    analytics.page("Landing Page", {
      title: "Whisker Home",
      category: "landing",
    });
  }, []);

  const posts = [
    {
      slug: "kitten-care",
      title: "Kitten Care 101",
      category: "Adoption",
      excerpt: "Everything you need to welcome your new kitten.",
      image: "/api/placeholder/600/400",
    },
    {
      slug: "cat-nutrition",
      title: "Cat Nutrition Hacks",
      category: "Care",
      excerpt: "Top tips to keep your cat healthy and happy.",
      image: "/api/placeholder/600/400",
    },
    {
      slug: "cat-toys",
      title: "Best Interactive Cat Toys",
      category: "Products",
      excerpt: "Engage your cat with these stimulating toy options.",
      image: "/api/placeholder/600/400",
    },
    {
      slug: "grooming-guide",
      title: "Seasonal Grooming Guide",
      category: "Care",
      excerpt: "Keep your cat looking their best year-round.",
      image: "/api/placeholder/600/400",
    },
  ];

  // sample data with all fields the new card needs
const products = [
  {
    id: "prod1",
    brand: "Iams",
    name: "Adult Dry Cat Food, 16-lb bag",
    category: "Care",
    vendor: "chewy",
    price: 49.00,           // sale / current price
    originalPrice: 55.99, 
    rating: 4.5,
    ratingCount: 3800,
    badge: "Best Seller",
    isDeal: true,           // toggles “Deal” ribbon if you want
    promo: "Spend $100, get <b>$30</b> eGift Card",
    image: "/iams.png",
  },
  {
    id: "prod2",
    brand: "Pawsitive",
    name: "Auto Feeder Pro",
    category: "Care",
    vendor: "chewy",
    price: 149.00,
    originalPrice: 159.00,

    rating: 4.2,
    ratingCount: 112,
    badge: "New",
    isDeal: false,
    promo: "New Customers Only: Spend $49+, Get $20 eGift Card",
    image: "/meowmix.png",
  },
  {
    id: "prod3",
    brand: "LaserFun",
    name: "Interactive Laser Toy",
    category: "Toys",
    vendor: "chewy",
    price: 29.99,
    originalPrice: 39.99,

    rating: 4.7,
    ratingCount: 1200,
    badge: null,
    isDeal: false,
    promo: null,
    image: "/american.png",
  },
  {
    id: "prod4",
    brand: "KittyPalace",
    name: "Premium Cat Tree",
    category: "Furniture",
    vendor: "chewy",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    ratingCount: 900,
    badge: "Sale",
    isDeal: true,
    promo: "Free Shipping on this item",
    image: "/original.png",
  },
];


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white text-black">
  {/* Hero Section */}
  <section className="relative w-full h-[400px] overflow-hidden flex justify-center items-center">
    <div className="relative w-full max-w-[1640px] h-full">
      <Image
        src="/banner.png"
        alt="Whisker Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  </section>


      {/* Latest Articles */}
      <section className="py-16 bg-gray-100 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-amber-700 font-medium hover:underline"
            >
              View all articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      layout="fill"
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <span className="text-amber-700 font-medium">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              href="/shop"
              className="text-amber-700 font-medium hover:underline"
            >
              Shop all products →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
              <div className="relative flex flex-col rounded-xl border bg-white shadow-sm hover:shadow-lg transition">
            
                {/* badge (e.g. “Deal”) */}
                {product.badge && (
                  <span className="absolute top-2 left-2 z-10 rounded bg-rose-700 px-2 py-0.5 text-xs font-semibold text-white">
                    {product.badge}
                  </span>
                )}
            
                {/* product image */}
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    layout="fill"
                    className="object-contain"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    priority
                  />
                </div>
            
                {/* details */}
                <div className="p-5 space-y-2 flex flex-col flex-grow">
            
                  {/* brand + name */}
                  <h3 className="text-sm font-semibold leading-snug">
                    {product.brand}{' '}
                    <span className="font-normal">{product.name}</span>
                  </h3>
            
                  {/* category */}
                  <p className="text-xs text-gray-500">
                    Category: {product.category}
                  </p>
            
                  {/* rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg
                          key={n}
                          className="h-4 w-4"
                          fill={n <= product.rating ? 'currentColor' : 'none'}
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
                          <span className="text-gray-400 font-medium"> ({product.ratingCount})</span>
                        )}
                      </span>
                    </div>
                  )}
            
                  {/* price block */}
                  <div className="space-y-0.5">
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold text-rose-700">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm line-through text-gray-400">${product.originalPrice}</span>
                      )}
                    </div>
                    {product.autoshipPrice && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-semibold text-amber-600">${product.autoshipPrice}</span>
                        <img src="/autoship.svg" alt="Autoship" className="h-4 w-auto" />
                      </div>
                    )}
                  </div>
            
                  {/* spacer pushes button to bottom if card height varies */}
                  <div className="flex-grow" />
            
                  {/* add to cart */}
                  <button className="w-full rounded-full bg-amber-600 py-2 text-sm font-medium text-white transition hover:bg-amber-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
            
            ))}
          </div>
        </div>
      </section>

      {/* You can apply similar fixes to Testimonials, Newsletter, and Footer sections if they include quotes */}
    </div>
  );
}
