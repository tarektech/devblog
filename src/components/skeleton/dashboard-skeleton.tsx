export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div>
        <div className="h-8 bg-muted animate-pulse rounded w-64 mb-4" />
        <div className="h-4 bg-muted animate-pulse rounded w-96 mb-6" />
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded w-32" />
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded" />
        ))}
      </div>

      {/* Recent Posts Skeleton */}
      <div>
        <div className="h-6 bg-muted animate-pulse rounded w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
