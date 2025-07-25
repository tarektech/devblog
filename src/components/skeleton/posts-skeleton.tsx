export function PostsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export function PostContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-96 bg-muted animate-pulse rounded-lg mb-8" />
      <div className="h-8 bg-muted animate-pulse rounded mb-4" />
      <div className="h-4 bg-muted animate-pulse rounded mb-6 w-3/4" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}

export function PostsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-full mb-3" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
            <div className="flex gap-2 ml-4">
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
