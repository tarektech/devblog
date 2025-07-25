# Database Setup Guide

This guide will help you set up the Supabase database for the Developers Blog platform.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose your organization and project name
3. Select a database password and region
4. Wait for the project to be created

## 2. Database Schema Setup

Run the following SQL commands in the Supabase SQL Editor (Database > SQL Editor):

### Create Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tags table
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE
);

-- Add foreign key constraint if not already exists
-- This ensures data integrity between posts and profiles
ALTER TABLE posts
ADD CONSTRAINT posts_author_id_profiles_fkey
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create post_categories junction table
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Create post_tags junction table
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create post_images table
CREATE TABLE post_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Create Indexes for Performance

```sql
-- Create indexes for better query performance
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_featured ON posts(featured);
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

## 3. Row Level Security (RLS) Policies

Enable RLS and create security policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Tags policies (public read, admin write)
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

-- Post categories policies
CREATE POLICY "Anyone can view post categories" ON post_categories
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own post categories" ON post_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_categories.post_id
      AND posts.author_id = auth.uid()
    )
  );

-- Post tags policies
CREATE POLICY "Anyone can view post tags" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own post tags" ON post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_tags.post_id
      AND posts.author_id = auth.uid()
    )
  );

-- Post images policies
CREATE POLICY "Anyone can view post images" ON post_images
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own post images" ON post_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_images.post_id
      AND posts.author_id = auth.uid()
    )
  );
```

## 4. Functions and Triggers

Create useful database functions:

```sql
-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, created_at)
  VALUES (new.id, new.email, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on posts
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 5. Sample Data (Optional)

Insert some sample data for testing:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('JavaScript', 'javascript', 'All about JavaScript programming'),
('React', 'react', 'React.js tutorials and tips'),
('Next.js', 'nextjs', 'Next.js framework guides'),
('TypeScript', 'typescript', 'TypeScript development'),
('CSS', 'css', 'CSS styling and design'),
('Backend', 'backend', 'Server-side development'),
('DevOps', 'devops', 'Development operations and deployment'),
('Tutorial', 'tutorial', 'Step-by-step tutorials');

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
('beginner', 'beginner'),
('intermediate', 'intermediate'),
('advanced', 'advanced'),
('tutorial', 'tutorial'),
('tips', 'tips'),
('best-practices', 'best-practices'),
('performance', 'performance'),
('security', 'security'),
('debugging', 'debugging'),
('testing', 'testing');
```

## 6. Storage Setup (Optional)

If you plan to use image uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `post-images`
3. Set the bucket to public
4. Create the following storage policy:

```sql
-- Storage policy for post images
CREATE POLICY "Public can view post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Users can upload post images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 7. Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following settings:
   - Site URL: `http://localhost:3000` (development)
   - Redirect URLs: `http://localhost:3000/auth/callback` (development)
3. Enable email authentication
4. Optionally enable other providers (Google, GitHub, etc.)

## 8. Verification

After setup, verify your database:

1. Check that all tables are created
2. Verify RLS policies are enabled
3. Test authentication flow
4. Ensure sample data is inserted correctly

## Troubleshooting

### Common Issues

1. **RLS Errors**: Make sure all policies are created correctly
2. **Foreign Key Errors**: Ensure the posts table references profiles(id) correctly
3. **Authentication Issues**: Check that the profile trigger is working
4. **Permission Errors**: Verify that your service role key has the correct permissions

### Useful Queries for Debugging

```sql
-- Check if profiles are created for users
SELECT u.email, p.*
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;

-- Check post counts by status
SELECT status, COUNT(*)
FROM posts
GROUP BY status;

-- Check RLS policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Verify foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
```

## Next Steps

After completing the database setup:

1. Update your `.env.local` file with the Supabase credentials
2. Test the connection by running the development server
3. Create your first user account through the application
4. Verify that the profile is automatically created
5. Test creating and publishing posts

For additional help, refer to the [Supabase Documentation](https://supabase.com/docs) or the main [README.md](../README.md) file.
