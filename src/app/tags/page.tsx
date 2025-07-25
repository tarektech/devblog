import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/supabase-queries';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'All Tags | DevBlog',
  description:
    'Explore all topics and technologies discussed on DevBlog. Find articles by browsing our comprehensive list of tags.',
  openGraph: {
    title: 'All Tags | DevBlog',
    description: 'Explore all topics and technologies discussed on DevBlog.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tags | DevBlog',
    description: 'Explore all topics and technologies discussed on DevBlog.',
  },
};

async function TagsGrid() {
  const tags = await getAllTags();

  if (tags.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No tags available yet</h2>
        <p className="text-muted-foreground mb-8">
          Tags will appear here as content gets published.
        </p>
        <Link href="/posts" className="text-orange-500 hover:underline">
          Browse all posts →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tags.map((tag) => (
        <Link key={tag.id} href={`/tags/${tag.slug}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 group border-2 hover:border-orange-500/20">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full mb-4 group-hover:bg-orange-500/20 transition-colors">
                <span className="text-2xl font-bold">#</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
                {tag.name}
              </h3>
              {tag.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tag.description}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-muted animate-pulse rounded-full mx-auto mb-4" />
            <div className="h-6 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/10 via-orange-600/5 to-orange-600/10 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-full text-lg font-medium mb-6">
              <span className="text-2xl">#</span>
              Tags
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore by Topic
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover articles and tutorials organized by technology, concept,
              or topic. Click on any tag to explore related content.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <TagsGrid />
        </Suspense>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts" className="text-orange-500 hover:underline">
              Browse All Posts →
            </Link>
            <Link
              href="/categories"
              className="text-orange-500 hover:underline"
            >
              View Categories →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
