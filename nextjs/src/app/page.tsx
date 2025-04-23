'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/segment';
import Image from 'next/image';

export default function Home() {
  useEffect(() => {
    analytics.page('Home Page', {
      title: 'Welcome to Whisker',
      category: 'landing',
    });
  }, []);

  return (
    <div className="min-h-screen bg-amber-700 text-black p-10 flex flex-col items-center justify-center font-sans">
      <Image src="/logo_white.png" alt="Whisker Logo" width={80} height={80} />
      <h1 className="text-4xl font-bold mt-6">Welcome to Whisker 🐾</h1>
      <p className="mt-4 text-lg max-w-xl text-center">
        Your trusted source for all things feline – from the best treats and toys, to tips for new
        cat parents.
      </p>

      <div className="mt-10 space-x-4">
        <a
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          href="/blog"
        >
          Visit the Blog
        </a>
        <a
          className="border border-black px-6 py-3 rounded-full hover:bg-gray-100 transition"
          href="/shop"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}
