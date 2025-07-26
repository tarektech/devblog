// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  // During build time or in some deployment scenarios, environment variables might not be available
  // Log warning but don't throw error during build process
  if (process.env.NODE_ENV !== 'development') {
    console.warn(
      'Supabase environment variables not found. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }
}

// cookies() return type is not explicitly exported by Next.js 15.4.4
// so we use ReturnType<typeof cookies> for best type safety
export const createClient = async (
  cookieStorePromise: ReturnType<typeof cookies>
) => {
  const cookieStore = await cookieStorePromise;

  // Provide fallback values for build time
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseKey || 'placeholder-anon-key';

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

// Public client for server-side rendering without cookies (for static rendering)
export const createPublicClient = () => {
  // Provide fallback values for build time
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseKey || 'placeholder-anon-key';

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // No-op for public client
      },
    },
  });
};
