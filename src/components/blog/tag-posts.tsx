import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostsByTag, getTagBySlug } from '@/lib/supabase-queries';
import { PostCard } from './post-card';
import { Button } from '@/components/ui/button';

interface TagPostsProps {
  tagSlug: string;
}

export async function TagPosts({ tagSlug }: TagPostsProps) {
  const [tag, posts] = await Promise.all([
    getTagBySlug(tagSlug),
    getPostsByTag(tagSlug),
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-full text-lg font-medium mb-4">
          #{tag.name}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Posts tagged with &ldquo;{tag.name}&rdquo;
        </h1>
        <p className="text-xl text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No posts found</h2>
          <p className="text-muted-foreground mb-8">
            There are no published posts with the tag &ldquo;{tag.name}&rdquo;
            yet.
          </p>
          <Link href="/posts">
            <Button>Browse All Posts</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
