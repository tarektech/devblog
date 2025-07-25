import { Suspense } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentPosts } from '@/components/dashboard/recent-posts';
import {
  DashboardSkeleton,
  DashboardErrorBoundary,
} from '@/components/skeleton';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard | DevBlog',
  description:
    'Manage your blog posts, view analytics, and update your profile.',
  robots: 'noindex, nofollow',
};

async function checkAuth() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }
}

export default async function DashboardPage() {
  await checkAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <DashboardErrorBoundary>
          <Suspense fallback={<DashboardSkeleton />}>
            <WelcomeSection />

            <div className="mb-8">
              <DashboardStats />
            </div>

            <RecentPosts />
          </Suspense>
        </DashboardErrorBoundary>
      </div>
    </div>
  );
}
