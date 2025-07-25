// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// cookies() return type is not explicitly exported by Next.js 15.4.4
// so we use ReturnType<typeof cookies> for best type safety
export const createClient = async (
  cookieStorePromise: ReturnType<typeof cookies>
) => {
  const cookieStore = await cookieStorePromise;
  return createServerClient(supabaseUrl!, supabaseKey!, {
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
  return createServerClient(supabaseUrl!, supabaseKey!, {
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
