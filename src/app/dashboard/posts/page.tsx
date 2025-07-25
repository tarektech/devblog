import { Suspense } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PostsList } from '@/components/dashboard/posts-list';
import { PostsListSkeleton } from '@/components/skeleton';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Manage Posts | Dashboard | DevBlog',
  description: 'Manage your blog posts, edit content, and track performance.',
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

  return user;
}

export default async function PostsManagementPage() {
  await checkAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Manage Posts
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="outline">← Dashboard</Button>
            </Link>
            <Link href="/write">
              <Button>Create New Post</Button>
            </Link>
          </div>
        </div>

        {/* Posts List */}
        <Suspense fallback={<PostsListSkeleton />}>
          <PostsList />
        </Suspense>
      </div>
    </div>
  );
}
