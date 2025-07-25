'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface SmartWriteButtonProps {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function SmartWriteButton({
  variant = 'outline',
  size = 'lg',
  className = 'text-lg px-8',
  children = 'Start Writing',
}: SmartWriteButtonProps) {
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

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled
      >
        {children}
      </Button>
    );
  }

  if (user) {
    return (
      <Link href="/write">
        <Button
          variant={variant}
          size={size}
          className={`${className} cursor-pointer`}
        >
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/auth/signup">
      <Button
        variant={variant}
        size={size}
        className={`${className} cursor-pointer`}
      >
        {children}
      </Button>
    </Link>
  );
}
