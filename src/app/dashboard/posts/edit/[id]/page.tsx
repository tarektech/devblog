import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { PostForm } from '@/components/dashboard/post-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { getPostForEditing } from '@/lib/supabase-dashboard-queries';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Post | DevBlog',
  description: 'Edit your blog post.',
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

export default async function EditPostPage({ params }: EditPostPageProps) {
  await checkAuth();

  const { id } = await params;

  const post = await getPostForEditing(id);

  if (!post) {
    notFound();
  }

  // Transform post data to match PostForm interface
  const initialData = {
    title: post.title,
    content: post.content,
    imageUrl: post.image_url || '',
    status: post.status as 'draft' | 'published',
    featured: post.featured || false,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Post</h1>
            <p className="text-muted-foreground">Update your blog post</p>
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
        <PostForm initialData={initialData} isEditing={true} postId={id} />
      </div>
    </div>
  );
}
