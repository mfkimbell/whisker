'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '@/lib/segment';

export default function HomePage() {
  useEffect(() => {
    analytics.page('Landing Page', {
      title: 'Whisker Home',
      category: 'landing',
    });
  }, []);

  // Featured blog posts
  const posts = [
    {
      slug: 'kitten-care',
      title: 'Kitten Care 101',
      category: 'Adoption',
      excerpt: 'Everything you need to welcome your new kitten.',
      image: '/api/placeholder/600/400',
    },
    {
      slug: 'cat-nutrition',
      title: 'Cat Nutrition Hacks',
      category: 'Care',
      excerpt: 'Top tips to keep your cat healthy and happy.',
      image: '/api/placeholder/600/400',
    },
    {
      slug: 'cat-toys',
      title: 'Best Interactive Cat Toys',
      category: 'Products',
      excerpt: 'Engage your cat with these stimulating toy options.',
      image: '/api/placeholder/600/400',
    },
    {
      slug: 'grooming-guide',
      title: 'Seasonal Grooming Guide',
      category: 'Care',
      excerpt: 'Keep your cat looking their best year-round.',
      image: '/api/placeholder/600/400',
    },
  ];

  const products = [
    { 
      id: 'prod1', 
      name: 'Kitten Starter Kit', 
      category: 'Care', 
      price: 49,
      image: '/api/placeholder/400/400',
      badge: 'Best Seller'
    },
    { 
      id: 'prod2', 
      name: 'Auto Feeder Pro', 
      category: 'Care', 
      price: 149,
      image: '/api/placeholder/400/400',
      badge: 'New'
    },
    { 
      id: 'prod3', 
      name: 'Interactive Laser Toy', 
      category: 'Toys', 
      price: 29.99,
      image: '/api/placeholder/400/400'
    },
    { 
      id: 'prod4', 
      name: 'Premium Cat Tree', 
      category: 'Furniture', 
      price: 199.99,
      image: '/api/placeholder/400/400',
      badge: 'Sale'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-600 to-amber-700 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="py-20 md:py-28 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white rounded-full mb-6 flex items-center justify-center">
              <span className="text-5xl">🐾</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-md">
              Welcome to Whisker
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mb-10">
              Your one-stop for expert cat care guides, subscription food plans, premium toys & more.
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

      {/* Featured Categories */}
      <section className="py-16 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-amber-50 rounded-xl p-8 text-center transition hover:shadow-lg">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Advice</h3>
              <p>Comprehensive guides on cat care, health, behavior, and more</p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-8 text-center transition hover:shadow-lg">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Products</h3>
              <p>Curated selection of the best cat products on the market</p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-8 text-center transition hover:shadow-lg">
              <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Subscription Plans</h3>
              <p>Regular deliveries of food, toys, and supplies for your feline friend</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 bg-gray-100 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <Link href="/blog" className="text-amber-700 font-medium hover:underline">
              View all articles →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                    <span className="text-amber-700 font-medium">Read more →</span>
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
            <Link href="/shop" className="text-amber-700 font-medium hover:underline">
              Shop all products →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition hover:scale-105"
                    />
                    {product.badge && (
                      <div className="absolute top-0 left-0 bg-black text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">Category: {product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">${product.price}</span>
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

      {/* Testimonials */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">What Cat Parents Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white text-amber-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">😺</span>
                </div>
                <div>
                  <h3 className="font-bold">Amanda L.</h3>
                  <p className="text-sm text-white/80">Cat mom to Whiskers & Luna</p>
                </div>
              </div>
              <p className="italic">"The Kitten Starter Kit was exactly what I needed when I adopted my two kittens. Everything in one package, delivered to my door!"</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white text-amber-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">😸</span>
                </div>
                <div>
                  <h3 className="font-bold">Michael T.</h3>
                  <p className="text-sm text-white/80">Cat dad to Oliver</p>
                </div>
              </div>
              <p className="italic">"The Auto Feeder Pro has been a game-changer for my busy schedule. My cat gets fed on time, every time, even when I'm not home."</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white text-amber-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">😻</span>
                </div>
                <div>
                  <h3 className="font-bold">Sarah K.</h3>
                  <p className="text-sm text-white/80">Cat mom to Mittens</p>
                </div>
              </div>
              <p className="italic">"I love the blog articles! The nutrition guide helped me understand what my senior cat needs in her diet. Thank you, Whisker!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Cat-Loving Community</h2>
          <p className="text-lg mb-8 text-gray-300">Sign up for our newsletter to receive product updates, exclusive offers, and expert cat care tips.</p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-full text-black"
              required
            />
            <button 
              type="submit" 
              className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm mt-4 text-gray-400">We respect your privacy and will never share your information.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Whisker 🐾</h3>
              <p className="text-gray-400">Your trusted source for all things cat-related since 2023.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                <li><Link href="/shop" className="text-gray-400 hover:text-white transition">Shop</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link href="/category/care" className="text-gray-400 hover:text-white transition">Cat Care</Link></li>
                <li><Link href="/category/nutrition" className="text-gray-400 hover:text-white transition">Nutrition</Link></li>
                <li><Link href="/category/toys" className="text-gray-400 hover:text-white transition">Toys & Enrichment</Link></li>
                <li><Link href="/category/health" className="text-gray-400 hover:text-white transition">Health & Wellness</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition">
                  <span className="sr-only">Facebook</span>
                  <span>📱</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition">
                  <span className="sr-only">Twitter</span>
                  <span>📱</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition">
                  <span className="sr-only">Instagram</span>
                  <span>📱</span>
                </a>
              </div>
              <p className="text-gray-400">Email: hello@whisker.com</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Whisker. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
