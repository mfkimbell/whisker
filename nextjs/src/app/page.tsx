// app/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '@/lib/segment';
import Image from 'next/image';

// Hard-coded demo content
const posts = [
  {
    slug: 'kitten-care',
    title: 'Kitten Care 101',
    category: 'Adoption',
    excerpt: 'Everything you need to welcome your new kitten.',
  },
  {
    slug: 'cat-nutrition',
    title: 'Cat Nutrition Hacks',
    category: 'Care',
    excerpt: 'Top tips to keep your cat healthy and happy.',
  },
];

const catalog = [
  { id: 'prod1', name: 'Kitten Starter Kit', category: 'Care', price: 49 },
  { id: 'prod2', name: 'Auto Feeder Pro', category: 'Care', price: 149 },
];

export default function HomePage() {
  useEffect(() => {
    analytics.page('Landing Page', {
      title: 'Whisker Home',
      category: 'landing',
    });
  }, []);

  return (
    <div className="min-h-screen bg-amber-700 text-black p-10 font-sans">
      {/* Hero */}
      <div className="flex flex-col items-center">
        <Image src="/logo_white.png" alt="Whisker Logo" width={100} height={100} className="mb-6" />
        <h1 className="text-5xl font-bold">Welcome to Whisker 🐾</h1>
        <p className="mt-4 text-lg max-w-2xl text-center">
          Your one-stop for expert cat care guides, subscription food plans, premium toys & more.
        </p>
      </div>

      {/* Blog Previews */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold mb-4">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white text-black p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{post.excerpt}</p>
              <span className="mt-4 inline-block text-indigo-600 hover:underline">Read more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Previews */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map((prod) => (
            <div
              key={prod.id}
              className="bg-white text-black p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold">{prod.name}</h3>
              <p className="mt-2">Category: {prod.category}</p>
              <p className="mt-1 font-semibold">${prod.price}</p>
              <Link
                href={`/product/${prod.id}`}
                className="mt-4 inline-block text-indigo-600 hover:underline"
              >
                View product →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
