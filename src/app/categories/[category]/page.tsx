import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/supabase-queries';
import { CategoryPosts } from '@/components/blog/category-posts';
import { CategoriesSidebar } from '@/components/blog/categories-sidebar';
import { PostsGridSkeleton, SidebarSkeleton } from '@/components/skeleton';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);

  if (!category) {
    return {
      title: 'Category Not Found | DevBlog',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${categoryData.name} | DevBlog`,
    description:
      categoryData.description ||
      `Browse all posts in the "${categoryData.name}" category. Discover articles and tutorials related to ${categoryData.name}.`,
    openGraph: {
      title: `${categoryData.name} | DevBlog`,
      description:
        categoryData.description ||
        `Browse all posts in the "${categoryData.name}" category.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} | DevBlog`,
      description:
        categoryData.description ||
        `Browse all posts in the "${categoryData.name}" category.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <Suspense fallback={<SidebarSkeleton />}>
            <CategoriesSidebar />
          </Suspense>

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<PostsGridSkeleton />}>
                <CategoryPosts categorySlug={category} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
