'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export function PostsCTA() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-xl p-12 text-center">
      <h3 className="text-3xl font-bold mb-4">
        Ready to Share Your Knowledge?
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Join our community of developers and contribute your expertise to help
        others learn and grow.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isLoading ? (
          <div className="inline-flex items-center justify-center px-6 py-3 bg-orange-600/50 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
            Start Writing Today
          </div>
        ) : user ? (
          <Link
            href="/write"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
          >
            Start Writing Today
          </Link>
        ) : (
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
          >
            Start Writing Today
          </Link>
        )}
        <Link
          href="/tags"
          className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600/10 transition-colors font-medium cursor-pointer"
        >
          Explore Topics
        </Link>
      </div>
    </div>
  );
}
