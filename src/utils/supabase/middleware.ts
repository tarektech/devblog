// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  // During build time or middleware initialization, environment variables might not be available
  // Log warning but don't throw error during build process
  if (process.env.NODE_ENV !== 'development') {
    console.warn(
      'Supabase environment variables not found in middleware. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }
}

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Provide fallback values for build time
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseKey || 'placeholder-anon-key';

  // Create a Supabase client configured to use cookies
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  return supabaseResponse;
};
