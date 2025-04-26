"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { analytics } from "@/lib/segment";
import Image from "next/image";
import { posts, products } from "@/lib/data/products";
import { Product } from "@/components/Product";

export default function HomePage() {
  useEffect(() => {
    analytics.page("Landing Page", {
      title: "Whisker Home",
      category: "landing",
    });
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:border-amber-600 transition h-full flex flex-col border border-transparent group">
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      layout="fill"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      {post.category}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-5 flex-grow flex flex-col">
                    <p className="text-xs text-gray-400 mb-1">{post.date}</p>

                    <h3 className="text-lg font-bold mb-1">{post.title}</h3>

                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>

                    <span className="mt-auto inline-flex items-center text-amber-700 hover:underline font-semibold">
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
            {products.slice(0, 4).map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* You can apply similar fixes to Testimonials, Newsletter, and Footer sections if they include quotes */}
    </div>
  );
}
