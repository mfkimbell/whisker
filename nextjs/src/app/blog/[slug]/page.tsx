'use client';
// app/blog/[slug]/page.tsx
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/lib/segment';

const posts: Record<string, any> = {
  'kitten-care': { id: 'post1', title: 'Kitten Care 101', category: 'Adoption' },
  'cat-nutrition': { id: 'post2', title: 'Cat Nutrition Hacks', category: 'Care' },
};

export default function BlogPost() {
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : (slug ?? 'unknown');
  const post = posts[slugStr] || { id: slugStr, title: slugStr, category: 'General' };

  useEffect(() => {
    analytics.track('Viewed Blog Post', {
      postId: post.id,
      title: post.title,
      category: post.category,
    });
  }, [post.id]);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Category: {post.category}</p>
    </div>
  );
}
