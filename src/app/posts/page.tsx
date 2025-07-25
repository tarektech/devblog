import { Suspense } from 'react';
import { Metadata } from 'next';
import { PostsGrid } from '@/components/blog/posts-grid';
import { FilterSidebar } from '@/components/blog/filter-sidebar';
import { PostsCTA } from '@/components/blog/posts-cta';
import { PostsGridSkeleton, SidebarSkeleton } from '@/components/skeleton';

export const metadata: Metadata = {
  title: 'All Posts | DevBlog',
  description:
    'Browse all published articles and tutorials from our developer community. Discover the latest insights, best practices, and technical content.',
  openGraph: {
    title: 'All Posts | DevBlog',
    description:
      'Browse all published articles and tutorials from our developer community.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Posts | DevBlog',
    description:
      'Browse all published articles and tutorials from our developer community.',
  },
};

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/10 via-orange-600/5 to-orange-600/10 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-full text-lg font-medium mb-6">
              📝 All Posts
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Developer Articles & Tutorials
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of technical articles, tutorials, and
              insights from developers around the world. Learn, share, and grow
              together.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Suspense fallback={<SidebarSkeleton />}>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Posts Grid */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Latest Articles</h2>
              <p className="text-sm text-muted-foreground">
                Discover knowledge from our community
              </p>
            </div>
            <Suspense fallback={<PostsGridSkeleton />}>
              <PostsGrid />
            </Suspense>
          </main>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20">
          <PostsCTA />
        </div>
      </div>
    </div>
  );
}
