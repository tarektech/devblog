import Link from 'next/link';
import { getRecentPosts } from '@/lib/supabase-queries';
import { PostCard } from './post-card';
import { Button } from '@/components/ui/button';

export async function RelatedPosts() {
  const recentPosts = await getRecentPosts(3);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-center">
        More from our community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/posts">
          <Button variant="outline">View All Posts</Button>
        </Link>
      </div>
    </section>
  );
}
