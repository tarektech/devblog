export function AuthorProfileSkeleton() {
  return (
    <div>
      {/* Author Header Skeleton */}
      <div className="text-center mb-12">
        <div className="w-30 h-30 bg-muted animate-pulse rounded-full mx-auto mb-6" />
        <div className="h-8 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-muted animate-pulse rounded w-80 mx-auto mb-6" />
        <div className="h-4 bg-muted animate-pulse rounded w-48 mx-auto" />
      </div>

      {/* Posts Skeleton */}
      <div className="h-6 bg-muted animate-pulse rounded w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
