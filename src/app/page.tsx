import { Suspense } from 'react';
import { HeroSection } from '@/components/blog/hero-section';
import { PostCard } from '@/components/blog/post-card';
import { SmartWriteButton } from '@/components/blog/smart-write-button';
import { getFeaturedPosts, getRecentPosts } from '@/lib/supabase-queries';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts(3);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Posts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our hand-picked selection of the most valuable content from
            our community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

async function RecentPosts() {
  const recentPosts = await getRecentPosts(6);

  if (recentPosts.length === 0) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Posts</h2>
          <p className="text-xl text-muted-foreground mb-8">
            No posts available yet. Be the first to share your knowledge!
          </p>
          <SmartWriteButton size="lg" variant="default" className="px-6">
            Get Started
          </SmartWriteButton>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Posts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the newest articles and tutorials from our
            developer community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/posts">
            <Button variant="outline" size="lg">
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Posts */}
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedPosts />
      </Suspense>

      {/* Recent Posts */}
      <Suspense fallback={<LoadingSkeleton />}>
        <RecentPosts />
      </Suspense>

      {/* Newsletter/CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600/10 via-orange-600/5 to-orange-600/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Developer Community
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Share your expertise, learn from others, and grow your skills with
            developers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SmartWriteButton
              size="lg"
              variant="default"
              className="text-lg px-8"
            >
              Start Publishing
            </SmartWriteButton>
            <Link href="/posts">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Browse Content
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
