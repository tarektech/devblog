import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { Post, PostWithAuthor, Profile } from './types';

export interface DatabaseResult<T> {
  data: T | null;
  error: string | null;
  type: 'success' | 'error' | 'not_found' | 'unauthorized';
}

// Get current user's profile
export async function getCurrentUserProfile(): Promise<
  DatabaseResult<Profile>
> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return {
        data: null,
        error: 'Authentication failed. Please sign in again.',
        type: 'unauthorized',
      };
    }

    if (!user) {
      return {
        data: null,
        error: 'No user session found. Please sign in.',
        type: 'unauthorized',
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);

      if (error.code === 'PGRST116') {
        // Profile doesn't exist, try to create it
        const displayName = user.user_metadata?.display_name || user.email;
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            display_name: displayName,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return {
            data: null,
            error:
              'Profile not found and could not be created. Please contact support.',
            type: 'not_found',
          };
        }

        return {
          data: newProfile,
          error: null,
          type: 'success',
        };
      }

      return {
        data: null,
        error: `Database error: ${error.message}`,
        type: 'error',
      };
    }

    return {
      data,
      error: null,
      type: 'success',
    };
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return {
      data: null,
      error: 'An unexpected error occurred. Please try again later.',
      type: 'error',
    };
  }
}

// Get current user's posts (including drafts)
export async function getCurrentUserPosts(): Promise<PostWithAuthor[]> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
				*,
				profiles:author_id (
					id,
					display_name,
					avatar_url,
					bio
				)
			`
      )
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCurrentUserPosts:', error);
    return [];
  }
}

// Get post by ID for editing (only if user owns it)
export async function getPostForEditing(postId: string): Promise<Post | null> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('author_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching post for editing:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPostForEditing:', error);
    return null;
  }
}

// Create a new post
export async function createPost(postData: {
  title: string;
  content: string;
  image_url?: string;
  status: 'draft' | 'published';
  featured?: boolean;
}): Promise<{ data: Post | null; error: string | null }> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Set published_at if status is published
    const published_at =
      postData.status === 'published' ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...postData,
        author_id: user.id,
        published_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in createPost:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Update an existing post
export async function updatePost(
  postId: string,
  postData: {
    title?: string;
    content?: string;
    image_url?: string;
    status?: 'draft' | 'published';
    featured?: boolean;
  }
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Update data with timestamp
    const updateData: Record<string, unknown> = {
      ...postData,
      updated_at: new Date().toISOString(),
    };

    // Set published_at if status is being changed to published
    if (postData.status === 'published') {
      const { data: currentPost } = await supabase
        .from('posts')
        .select('published_at')
        .eq('id', postId)
        .eq('author_id', user.id)
        .single();

      if (currentPost && !currentPost.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('author_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in updatePost:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Delete a post
export async function deletePost(
  postId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', user.id);

    if (error) {
      console.error('Error deleting post:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in deletePost:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Update user profile
export async function updateUserProfile(profileData: {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return { data: null, error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: null, error: 'Profile not found' };
    }

    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Get dashboard analytics for current user
export async function getDashboardAnalytics() {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user's posts with analytics
    const { data: posts } = await supabase
      .from('posts')
      .select('id, status, view_count, created_at')
      .eq('author_id', user.id);

    if (!posts) return null;

    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.status === 'published').length;
    const draftPosts = posts.filter((p) => p.status === 'draft').length;
    const totalViews = posts.reduce(
      (sum, post) => sum + (post.view_count || 0),
      0
    );

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
    };
  } catch (error) {
    console.error('Error in getDashboardAnalytics:', error);
    return null;
  }
}
