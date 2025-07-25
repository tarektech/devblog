import Link from 'next/link';
import { getAllCategories } from '@/lib/supabase-queries';

export async function CategoriesSidebar() {
  const allCategories = await getAllCategories();

  if (allCategories.length === 0) {
    return null;
  }

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-8">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-orange-500">All Categories</h3>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="block text-sm hover:text-orange-500 transition-colors p-2 rounded hover:bg-orange-500/10"
              >
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {category.description.slice(0, 80)}
                    {category.description.length > 80 && '...'}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <Link
            href="/posts"
            className="text-sm text-orange-500 hover:underline mt-4 inline-block"
          >
            Browse all posts →
          </Link>
        </div>
      </div>
    </aside>
  );
}
