import Link from 'next/link';
import { getCurrentUserProfile } from '@/lib/supabase-dashboard-queries';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/skeleton';

function RefreshButton() {
  'use client';

  return (
    <Button onClick={() => window.location.reload()} className="cursor-pointer">
      Refresh Page
    </Button>
  );
}

export async function WelcomeSection() {
  const result = await getCurrentUserProfile();

  // Handle different error types
  if (result.type === 'unauthorized') {
    return (
      <div className="mb-8">
        <ErrorMessage
          title="Authentication Required"
          message={result.error || 'Please sign in to access your dashboard.'}
          actionButton={
            <Link href="/auth/signin">
              <Button className="cursor-pointer">Sign In</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (result.type === 'not_found') {
    return (
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to DevBlog!
        </h1>
        <ErrorMessage
          title="Profile Setup Required"
          message="Your profile hasn't been set up yet. Please complete your profile to get started."
          actionButton={
            <Link href="/dashboard/profile">
              <Button className="cursor-pointer">Complete Profile</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (result.type === 'error') {
    return (
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Dashboard</h1>
        <ErrorMessage
          title="Failed to Load Profile"
          message={
            result.error ||
            'There was an error loading your profile. Please try refreshing the page.'
          }
          actionButton={<RefreshButton />}
        />
      </div>
    );
  }

  // Success case - render normal welcome section
  const profile = result.data;

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!
      </h1>
      <p className="text-xl text-muted-foreground mb-6">
        Here&apos;s an overview of your blog activity and recent posts.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/write">
          <Button size="lg" className="text-lg px-8 cursor-pointer">
            Write New Post
          </Button>
        </Link>
        <Link href="/dashboard/posts">
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 cursor-pointer"
          >
            Manage Posts
          </Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 cursor-pointer"
          >
            Edit Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
