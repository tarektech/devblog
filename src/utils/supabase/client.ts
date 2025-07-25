import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);

// Public client for server-side rendering without cookies
export const createPublicClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
