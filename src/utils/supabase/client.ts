import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  // During build time, environment variables might not be available
  // Only throw error in browser/runtime, not during build
  if (typeof window !== 'undefined') {
    console.error('Missing Supabase environment variables');
  }
}

export const createClient = () => {
  // Provide fallback values for build time
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseKey || 'placeholder-anon-key';

  return createBrowserClient(url, key);
};

// Public client for server-side rendering without cookies
export const createPublicClient = () => {
  // Provide fallback values for build time
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseKey || 'placeholder-anon-key';

  return createBrowserClient(url, key);
};
