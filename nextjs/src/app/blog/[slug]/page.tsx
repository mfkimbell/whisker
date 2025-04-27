'use client';
// app/blog/[slug]/page.tsx
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/lib/segment';
import { prisma } from '@/lib/db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const posts: Record<string, any> = {
  'kitten-care': { id: 'post1', title: 'Kitten Care 101', category: 'Adoption' },
  'cat-nutrition': { id: 'post2', title: 'Cat Nutrition Hacks', category: 'Care' },
};

export default async function BlogPost() {
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : (slug ?? 'unknown');
  const post = posts[slugStr] || { id: slugStr, title: slugStr, category: 'General' };
  const user = await analytics.user();
  console.log("user", user)
  const phone = process.env.MITCH_WHATSAPP_NUMBER

  let user2 = await prisma.user.findUnique({
    where: { phone },
  });
  console.log("user2", user2)

  useEffect(() => {
    analytics.track('Viewed Blog Post', {
      postId: post.id,
      title: post.title,
      category: post.category,
    });
    

    // analytics.identify(userId, {
    //   email,
    //   phone,
    //   phoneVerified: false,
    //   smsOptIn: false,
    // });
    analytics.track('Signed Up', { method: 'email+phone' });
    
  }, [post.id]);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Category: {post.category}</p>
    </div>
  );
}
