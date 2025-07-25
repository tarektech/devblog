'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl">DevBlog</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/tags"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/categories"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Categories
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link href="/write">
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                  >
                    Write
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
