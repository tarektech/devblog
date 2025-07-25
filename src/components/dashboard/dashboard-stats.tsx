import { getDashboardAnalytics } from '@/lib/supabase-dashboard-queries';
import { Card } from '@/components/ui/card';

export async function DashboardStats() {
  const analytics = await getDashboardAnalytics();

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-4 bg-muted animate-pulse rounded mb-2" />
            <div className="h-8 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Posts',
      value: analytics.totalPosts,
      color: 'text-blue-500',
    },
    {
      label: 'Published',
      value: analytics.publishedPosts,
      color: 'text-green-500',
    },
    {
      label: 'Drafts',
      value: analytics.draftPosts,
      color: 'text-orange-500',
    },
    {
      label: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
        </Card>
      ))}
    </div>
  );
}
