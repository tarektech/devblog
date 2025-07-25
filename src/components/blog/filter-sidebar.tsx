import Link from 'next/link';
import { getAllTags, getAllCategories } from '@/lib/supabase-queries';

export async function FilterSidebar() {
  const [tags, categories] = await Promise.all([
    getAllTags(),
    getAllCategories(),
  ]);

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-8 space-y-8">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-orange-500">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-sm bg-muted hover:bg-orange-500/20 px-3 py-1 rounded-full transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            {tags.length > 10 && (
              <Link
                href="/tags"
                className="text-sm text-orange-500 hover:underline mt-4 inline-block"
              >
                View all tags →
              </Link>
            )}
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-orange-500">Categories</h3>
            <div className="space-y-2">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block text-sm hover:text-orange-500 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            {categories.length > 8 && (
              <Link
                href="/categories"
                className="text-sm text-orange-500 hover:underline mt-4 inline-block"
              >
                View all categories →
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
