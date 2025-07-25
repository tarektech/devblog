import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostById, incrementPostViewCount } from '@/lib/supabase-queries';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { formatDistanceToNow } from 'date-fns';

interface PostContentProps {
  id: string;
}

export async function PostContent({ id }: PostContentProps) {
  // Check if user is authenticated and get their ID
  const supabase = await createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('PostContent - User:', user?.id);
  console.log('PostContent - Post ID:', id);

  // Try to get the post (include unpublished to check ownership)
  const post = await getPostById(id, true);

  console.log('PostContent - Post found:', !!post);
  console.log('PostContent - Post status:', post?.status);
  console.log('PostContent - Post author:', post?.author_id);

  if (!post) {
    console.log('PostContent - No post found, calling notFound()');
    notFound();
  }

  // If it's a draft, check if user has access
  if (post.status === 'draft') {
    if (!user) {
      console.log('PostContent - Draft post but no user, calling notFound()');
      notFound();
    }

    if (post.author_id !== user.id) {
      console.log(
        'PostContent - Draft post but user is not author, calling notFound()'
      );
      notFound();
    }
  }

  // Increment view count only for published posts (fire and forget)
  if (post.status === 'published') {
    incrementPostViewCount(post.id).catch(console.error);
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Draft indicator */}
      {post.status === 'draft' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
              DRAFT
            </span>
            <span className="text-orange-800 text-sm">
              This post is not published yet. Only you can see it.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        {/* Featured Image */}
        {post.image_url && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {/* Author */}
          {post.profiles && (
            <div className="flex items-center gap-2">
              {post.profiles.avatar_url && (
                <Image
                  src={post.profiles.avatar_url}
                  alt={post.profiles.display_name || 'Author'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <Link
                href={`/authors/${post.profiles.display_name}`}
                className="hover:text-orange-500 transition-colors"
              >
                {post.profiles.display_name || 'Anonymous'}
              </Link>
            </div>
          )}

          {/* Publication Date */}
          {post.published_at && (
            <time dateTime={post.published_at}>
              {formatDistanceToNow(new Date(post.published_at), {
                addSuffix: true,
              })}
            </time>
          )}

          {/* View Count */}
          {post.view_count !== null && post.view_count > 0 && (
            <span>{post.view_count.toLocaleString()} views</span>
          )}

          {/* Reading Time Estimate */}
          <span>
            {Math.ceil(post.content.split(' ').length / 200)} min read
          </span>
        </div>

        {/* Tags and Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-sm hover:bg-orange-500/30 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="bg-muted hover:bg-muted/80 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div
        className="prose prose-slate dark:prose-invert max-w-none prose-orange prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author Bio */}
      {post.profiles && post.profiles.bio && (
        <div className="mt-12 p-6 bg-card border rounded-lg">
          <div className="flex items-start gap-4">
            {post.profiles.avatar_url && (
              <Image
                src={post.profiles.avatar_url}
                alt={post.profiles.display_name || 'Author'}
                width={64}
                height={64}
                className="rounded-full flex-shrink-0"
              />
            )}
            <div>
              <h3 className="font-semibold mb-2">
                About {post.profiles.display_name || 'the Author'}
              </h3>
              <p className="text-muted-foreground mb-4">{post.profiles.bio}</p>
              <Link
                href={`/authors/${post.profiles.display_name}`}
                className="text-orange-500 hover:underline"
              >
                View all posts by {post.profiles.display_name} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
