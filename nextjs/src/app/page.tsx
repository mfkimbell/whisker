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

  const products = [
    {
      id: "prod1",
      name: "Kitten Starter Kit",
      category: "Care",
      price: 49,
      image: "/api/placeholder/400/400",
      badge: "Best Seller",
    },
    {
      id: "prod2",
      name: "Auto Feeder Pro",
      category: "Care",
      price: 149,
      image: "/api/placeholder/400/400",
      badge: "New",
    },
    {
      id: "prod3",
      name: "Interactive Laser Toy",
      category: "Toys",
      price: 29.99,
      image: "/api/placeholder/400/400",
    },
    {
      id: "prod4",
      name: "Premium Cat Tree",
      category: "Furniture",
      price: 199.99,
      image: "/api/placeholder/400/400",
      badge: "Sale",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-600 to-amber-700 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="py-20 md:py-28 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-md">
              <Image
                src="/welcome_to_whisker.png"
                alt="Whisker Logo"
                width={440}
                height={40}
              />
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-10">
              Your one-stop for expert cat care guides, subscription food plans,
              premium toys &amp; more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition shadow-md">
                  Shop Products
                </button>
              </Link>
              <Link href="/blog">
                <button className="bg-white text-amber-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition shadow-md">
                  Read Our Blog
                </button>
              </Link>
            </div>
          </div>
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
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition h-full flex flex-col">
                  <div className="relative h-64">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      className="object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">
                      Category: {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">
                        ${product.price}
                      </span>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm hover:bg-amber-700 transition">
                        Add to Cart
                      </button>
                    </div>
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
