'use client';
// app/blog/[slug]/page.tsx
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/lib/segment';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const posts: Record<string, any> = {
  'kitten-care': { id: 'post1', title: 'Kitten Care 101', category: 'Adoption' },
  'cat-nutrition': { id: 'post2', title: 'Cat Nutrition Hacks', category: 'Care' },
};

export default async function BlogPost() {
  const { slug } = useParams();
  const slugStr = Array.isArray(slug) ? slug[0] : slug ?? '';


  const post = posts.find((p: any) => p.slug === slugStr) ?? {
    slug:    slugStr,
    title:   slugStr.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    category: 'General',
    excerpt:  '',
    image:    '',
    date:     new Date().toISOString().slice(0, 10),
  };

  useEffect(() => {
    console.log('[BlogPost] useEffect triggered for slug:', slugStr);
    console.log('[BlogPost] post data:', post);

    (async () => {
      console.log('[BlogPost] awaiting analytics SDK…');
      const [ajs] = await analytics;
      console.log('[BlogPost] analytics SDK ready:', ajs);

      console.log('[BlogPost] sending "Viewed Blog Post" event');
      ajs.track('Viewed Blog Post', {
        postId:   post.slug,
        title:    post.title,
        category: post.category,
      });
      console.log('[BlogPost] "Viewed Blog Post" tracked');

      console.log('[BlogPost] updating FavoriteCategory trait:', post.category);
      ajs.identify({ FavoriteCategory: post.category });
      console.log('[BlogPost] identify() complete');
    })();
  }, [post.slug, post.title, post.category]);

  

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Category: {post.category}</p>
    </div>
  );
}
