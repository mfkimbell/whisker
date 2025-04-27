"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { analytics } from "@/lib/segment";
import Image from "next/image";
import { posts, products } from "@/lib/data/products";
import { Product } from "@/components/Product";

// Helper to get N random items from an array (no duplicates)
function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export default function HomePage() {

  const [featured, setFeatured] = useState(products.slice(0, 4));


  useEffect(() => {
    (async () => {
      // 1️⃣ Wait for the Analytics-Next SDK to be ready
      const [ajs] = await analytics;
  
      // 2️⃣ Track the page view
      ajs.page('Landing Page', { title: 'Whisker Home', category: 'landing' });
  
      // 3️⃣ Read the FavoriteCategory trait (if any)
      const fav = (ajs.user().traits() as Record<string, unknown>)?.[
        'FavoriteCategory'
      ] as string | undefined;
      console.log('[HomePage] FavoriteCategory trait =', fav);
  
      // 4️⃣ Build the featured-product list
      let chosen: typeof products = fav
        ? products.filter((p) => p.category === fav)
        : [];
  
      if (chosen.length < 4) {
        const fillers = sample(
          products.filter((p) => !chosen.includes(p)),
          4 - chosen.length
        );
        chosen = [...chosen, ...fillers];
      }
  
      // 5️⃣ Keep exactly four and update state
      setFeatured(chosen.slice(0, 4));
    })();
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
            {featured.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* You can apply similar fixes to Testimonials, Newsletter, and Footer sections if they include quotes */}
    </div>
  );
}
