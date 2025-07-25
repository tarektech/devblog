import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostsByCategory, getCategoryBySlug } from '@/lib/supabase-queries';
import { PostCard } from './post-card';
import { Button } from '@/components/ui/button';

interface CategoryPostsProps {
  categorySlug: string;
}

export async function CategoryPosts({ categorySlug }: CategoryPostsProps) {
  const [category, posts] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getPostsByCategory(categorySlug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-full text-lg font-medium mb-4">
          {category.name}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this
          category
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No posts found</h2>
          <p className="text-muted-foreground mb-8">
            There are no published posts in the &ldquo;{category.name}&rdquo;
            category yet.
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
