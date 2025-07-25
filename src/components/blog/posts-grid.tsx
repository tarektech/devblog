import { getPublishedPosts } from '@/lib/supabase-queries';
import { PostCard } from './post-card';
import { SmartWriteButton } from './smart-write-button';

export async function PostsGrid() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No posts available yet</h2>
        <p className="text-muted-foreground mb-8">
          Be the first to share your knowledge with the community!
        </p>
        <SmartWriteButton size="lg" variant="default" className="px-6" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
