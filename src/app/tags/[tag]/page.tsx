import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTagBySlug } from '@/lib/supabase-queries';
import { TagPosts } from '@/components/blog/tag-posts';
import { TagsSidebar } from '@/components/blog/tags-sidebar';
import { PostsGridSkeleton, SidebarSkeleton } from '@/components/skeleton';

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;

  try {
    const tagData = await getTagBySlug(tag);

    if (!tagData) {
      return {
        title: 'Tag Not Found | DevBlog',
        description: 'The requested tag could not be found.',
      };
    }

    return {
      title: `${tagData.name} | DevBlog`,
      description: `Browse all posts tagged with "${tagData.name}". Discover articles and tutorials related to ${tagData.name}.`,
      openGraph: {
        title: `${tagData.name} | DevBlog`,
        description: `Browse all posts tagged with "${tagData.name}".`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${tagData.name} | DevBlog`,
        description: `Browse all posts tagged with "${tagData.name}".`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for tag page:', error);
    return {
      title: 'Tag Not Found | DevBlog',
      description: 'The requested tag could not be found.',
    };
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <Suspense fallback={<SidebarSkeleton />}>
            <TagsSidebar />
          </Suspense>

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<PostsGridSkeleton />}>
              <TagPosts tagSlug={tag} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
