import Link from 'next/link';
import { getCurrentUserPosts } from '@/lib/supabase-dashboard-queries';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export async function RecentPosts() {
  const posts = await getCurrentUserPosts();
  const recentPosts = posts.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        <Link href="/dashboard/posts">
          <Button variant="outline">View All Posts</Button>
        </Link>
      </div>

      {recentPosts.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No posts yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t created any posts yet. Start sharing your knowledge
            with the community!
          </p>
          <Link href="/write">
            <Button size="lg">Create Your First Post</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              {post.status === 'draft' && (
                <div className="absolute top-2 right-2">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Draft
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
