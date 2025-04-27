'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/lib/segment';
import { posts} from '@/lib/data/products';



export default function BlogPost() {
  /* ------------- Grab slug from URL ------------- */
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : slug ?? '';

  /* ------------- Get post or fallback ------------- */
  const post: any =
    posts.find(p => p.slug === slugStr) ?? {
      slug: slugStr,
      title: slugStr.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: 'General',
      excerpt: '',
      image: '',
      date: new Date().toISOString().slice(0, 10),
      author: 'Admin',
      readTime: '—',
      content: ['Sorry, this post could not be found.']
    };

  /* ------------- Analytics (unchanged) ------------- */
  useEffect(() => {
    (async () => {
      const [ajs] = await analytics;
      ajs.track('Viewed Blog Post', {
        postId: post.slug,
        title: post.title,
        category: post.category
      });
      ajs.identify({ FavoriteCategory: post.category });
    })();
  }, [post.slug, post.title, post.category]);

  /* ------------- Render ------------- */
  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {/* Category badge */}
      {post.category && (
        <p className="text-sm font-semibold text-blue-600 uppercase mb-2">
          {post.category}
        </p>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="text-sm text-gray-500 mb-6 flex flex-wrap gap-x-2 gap-y-1">
        <span>{post.date}</span>
        <span>•</span>
        <span>By {post.author}</span>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>

      {/* Cover image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-1/2 h-auto rounded-lg mb-6"
        />
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-2xl text-black-700 font-semibold mb-6">{post.excerpt}</p>
      )}

      {/* Content */}
      {Array.isArray(post.content) ? (
        post.content.map((para: any, idx: any) => (
          <p key={idx} className="text-gray-800 leading-relaxed mb-4">
            {para}
          </p>
        ))
      ) : (
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      )}
    </article>
  );
}
