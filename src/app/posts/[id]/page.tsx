import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPostById } from '@/lib/supabase-queries';
import { PostContent } from '@/components/blog/post-content';
import { RelatedPosts } from '@/components/blog/related-posts';
import { PostContentSkeleton } from '@/components/skeleton';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Try to get the post (including unpublished for metadata generation)
    const { id } = await params;
    const post = await getPostById(id, true);

    if (!post) {
      return {
        title: 'Post Not Found | DevBlog',
        description: 'The requested blog post could not be found.',
      };
    }

    // Add draft indicator to title if it's a draft
    const titleSuffix = post.status === 'draft' ? ' (Draft)' : '';
    const title = `${post.title}${titleSuffix} | DevBlog`;

    return {
      title,
      description: post.content.slice(0, 160),
      keywords: post.tags?.map((tag) => tag.name).join(', '),
      authors: [{ name: post.profiles?.display_name || 'DevBlog Author' }],
      openGraph: {
        title: post.title,
        description: post.content.slice(0, 160),
        type: 'article',
        publishedTime: post.published_at || undefined,
        modifiedTime: post.updated_at || undefined,
        authors: [post.profiles?.display_name || 'DevBlog Author'],
        images: post.image_url
          ? [{ url: post.image_url, alt: post.title }]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.content.slice(0, 160),
        images: post.image_url ? [post.image_url] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for post page:', error);
    return {
      title: 'Post Not Found | DevBlog',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<PostContentSkeleton />}>
          <PostContent id={id} />
        </Suspense>

        <Suspense
          fallback={
            <div className="mt-16 h-64 bg-muted animate-pulse rounded-lg" />
          }
        >
          <RelatedPosts />
        </Suspense>
      </div>
    </div>
  );
}
