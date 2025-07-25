import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories } from '@/lib/supabase-queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'All Categories | DevBlog',
  description:
    'Browse content by category on DevBlog. Find articles organized by subject area, from web development to data science.',
  openGraph: {
    title: 'All Categories | DevBlog',
    description: 'Browse content by category on DevBlog.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Categories | DevBlog',
    description: 'Browse content by category on DevBlog.',
  },
};

async function CategoriesGrid() {
  const categories = await getAllCategories();

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No categories available yet</h2>
        <p className="text-muted-foreground mb-8">
          Categories will appear here as content gets organized.
        </p>
        <Link href="/posts" className="text-orange-500 hover:underline">
          Browse all posts →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 group border-2 hover:border-orange-500/20">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">
                  {category.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {category.description ? (
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {category.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic mb-4">
                  Explore articles in {category.name}
                </p>
              )}
              <div className="flex items-center text-sm text-orange-500 group-hover:text-orange-600 transition-colors">
                <span>Explore posts</span>
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-muted animate-pulse rounded-lg" />
              <div className="h-6 bg-muted animate-pulse rounded flex-1" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/10 via-orange-600/5 to-orange-600/10 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-full text-lg font-medium mb-6">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Categories
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse by Category
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our content organized by subject area. From frontend
              frameworks to backend architecture, find exactly what you&apos;re
              looking for.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <CategoriesGrid />
        </Suspense>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts" className="text-orange-500 hover:underline">
              Browse All Posts →
            </Link>
            <Link href="/tags" className="text-orange-500 hover:underline">
              View Tags →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
