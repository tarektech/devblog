import Link from 'next/link';
import { getAllTags } from '@/lib/supabase-queries';

export async function TagsSidebar() {
  const allTags = await getAllTags();

  if (allTags.length === 0) {
    return null;
  }

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="sticky top-8">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-orange-500">All Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="text-sm bg-muted hover:bg-orange-500/20 px-3 py-1 rounded-full transition-colors"
              >
                {tag.name}
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
