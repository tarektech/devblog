export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          title: string;
          content: string;
          image_url: string | null;
          status: 'draft' | 'published';
          created_at: string | null;
          updated_at: string | null;
          view_count: number | null;
          published_at: string | null;
          featured: boolean | null;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          title: string;
          content: string;
          image_url?: string | null;
          status?: 'draft' | 'published';
          created_at?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
          published_at?: string | null;
          featured?: boolean | null;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          title?: string;
          content?: string;
          image_url?: string | null;
          status?: 'draft' | 'published';
          created_at?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
          published_at?: string | null;
          featured?: boolean | null;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string | null;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
      };
      post_categories: {
        Row: {
          post_id: string;
          category_id: string;
        };
        Insert: {
          post_id: string;
          category_id: string;
        };
        Update: {
          post_id?: string;
          category_id?: string;
        };
      };
      post_images: {
        Row: {
          id: string;
          post_id: string | null;
          filename: string;
          original_name: string;
          alt_text: string;
          file_size: number | null;
          mime_type: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          filename: string;
          original_name: string;
          alt_text: string;
          file_size?: number | null;
          mime_type?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string | null;
          filename?: string;
          original_name?: string;
          alt_text?: string;
          file_size?: number | null;
          mime_type?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
};

export type Post = Database['public']['Tables']['posts']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type PostImage = Database['public']['Tables']['post_images']['Row'];

export type PostWithAuthor = Post & {
  profiles: Profile | null;
};

export type PostWithDetails = PostWithAuthor & {
  tags: Tag[];
  categories: Category[];
};
