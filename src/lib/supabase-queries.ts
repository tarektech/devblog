import { createClient, createPublicClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { PostWithAuthor, PostWithDetails } from './types';

// Get all published posts with author information
export async function getPublishedPosts(
  limit?: number
): Promise<PostWithAuthor[]> {
  try {
    const supabase = createPublicClient();

    let query = supabase
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
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPublishedPosts:', error);
    return [];
  }
}

// Get featured posts
export async function getFeaturedPosts(
  limit: number = 3
): Promise<PostWithAuthor[]> {
  try {
    const supabase = createPublicClient();

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
      .eq('status', 'published')
      .eq('featured', true)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedPosts:', error);
    return [];
  }
}

// Get recent posts (excluding featured ones)
export async function getRecentPosts(
  limit: number = 6
): Promise<PostWithAuthor[]> {
  try {
    const supabase = createPublicClient();

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
      .eq('status', 'published')
      .eq('featured', false)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecentPosts:', error);
    return [];
  }
}

// Get a single post by ID with full details
export async function getPostById(
  id: string,
  includeUnpublished: boolean = false
): Promise<PostWithDetails | null> {
  try {
    // Use authenticated client if we need to include unpublished posts
    const supabase = includeUnpublished
      ? await createClient(cookies())
      : createPublicClient();

    let query = supabase
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
      .eq('id', id);

    // Only filter by published status if we don't want to include unpublished posts
    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }

    if (!data) return null;

    // Fetch tags and categories separately due to many-to-many relationships
    const [tagsResult, categoriesResult] = await Promise.all([
      supabase
        .from('post_tags')
        .select(
          `
					tags (
						id,
						name,
						slug
					)
				`
        )
        .eq('post_id', data.id),
      supabase
        .from('post_categories')
        .select(
          `
					categories (
						id,
						name,
						slug,
						description
					)
				`
        )
        .eq('post_id', data.id),
    ]);

    const tags =
      tagsResult.data?.map((item) => item.tags).filter(Boolean) || [];
    const categories =
      categoriesResult.data?.map((item) => item.categories).filter(Boolean) ||
      [];

    return {
      ...data,
      tags,
      categories,
    } as PostWithDetails;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}

// Increment view count for a post (requires authentication context)
export async function incrementPostViewCount(postId: string): Promise<void> {
  try {
    const supabase = await createClient(cookies());

    // First get the current view count
    const { data: currentPost } = await supabase
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (currentPost) {
      const newViewCount = (currentPost.view_count || 0) + 1;

      const { error } = await supabase
        .from('posts')
        .update({ view_count: newViewCount })
        .eq('id', postId);

      if (error) {
        console.error('Error incrementing view count:', error);
      }
    }
  } catch (error) {
    console.error('Error in incrementPostViewCount:', error);
  }
}

// Get posts by tag slug
export async function getPostsByTag(
  tagSlug: string,
  limit?: number
): Promise<PostWithAuthor[]> {
  try {
    const supabase = createPublicClient();

    // First get the tag
    const { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single();

    if (!tag) return [];

    // Get posts with this tag
    let query = supabase
      .from('post_tags')
      .select(
        `
        posts!inner(
          *,
          profiles:author_id (
            id,
            display_name,
            avatar_url,
            bio
          )
        )
      `
      )
      .eq('tag_id', tag.id)
      .eq('posts.status', 'published')
      .not('posts.published_at', 'is', null)
      .order('posts.published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts by tag:', error);
      return [];
    }

    type QueryResult = { posts: PostWithAuthor };
    return (
      (data as unknown as QueryResult[])
        ?.map((item) => item.posts)
        .filter(Boolean) || []
    );
  } catch (error) {
    console.error('Error in getPostsByTag:', error);
    return [];
  }
}

// Get posts by category slug
export async function getPostsByCategory(
  categorySlug: string,
  limit?: number
): Promise<PostWithAuthor[]> {
  try {
    const supabase = createPublicClient();

    // First get the category
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!category) return [];

    // Get posts with this category
    let query = supabase
      .from('post_categories')
      .select(
        `
        posts!inner(
          *,
          profiles:author_id (
            id,
            display_name,
            avatar_url,
            bio
          )
        )
      `
      )
      .eq('category_id', category.id)
      .eq('posts.status', 'published')
      .not('posts.published_at', 'is', null)
      .order('posts.published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }

    type QueryResult = { posts: PostWithAuthor };
    return (
      (data as unknown as QueryResult[])
        ?.map((item) => item.posts)
        .filter(Boolean) || []
    );
  } catch (error) {
    console.error('Error in getPostsByCategory:', error);
    return [];
  }
}

// Get posts by author
export async function getPostsByAuthor(
  authorId: string,
  limit?: number
): Promise<PostWithAuthor[]> {
  try {
    const supabase = createPublicClient();

    let query = supabase
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
      .eq('author_id', authorId)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts by author:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPostsByAuthor:', error);
    return [];
  }
}

// Get author by display name
export async function getAuthorByDisplayName(displayName: string) {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('display_name', displayName)
      .single();

    if (error) {
      console.error('Error fetching author by display name:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAuthorByDisplayName:', error);
    return null;
  }
}

// Get tag by slug
export async function getTagBySlug(slug: string) {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching tag by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getTagBySlug:', error);
    return null;
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
}

// Get all tags
export async function getAllTags() {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching all tags:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllTags:', error);
    return [];
  }
}

// Get all categories
export async function getAllCategories() {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return [];
  }
}
