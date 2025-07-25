import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PostForm } from '@/components/dashboard/post-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Write New Post | DevBlog',
  description:
    'Create a new blog post and share your knowledge with the developer community.',
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

export default async function WritePage() {
  await checkAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Write New Post
            </h1>
            <p className="text-muted-foreground">
              Share your knowledge with the developer community
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="outline">← Dashboard</Button>
            </Link>
            <Link href="/dashboard/posts">
              <Button variant="outline">My Posts</Button>
            </Link>
          </div>
        </div>

        {/* Post Form */}
        <PostForm />
      </div>
    </div>
  );
}
