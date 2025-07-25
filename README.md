# Developers Blog Platform

A modern, full-stack developer blog platform built with Next.js 15, React 19, TypeScript, and Supabase. This platform allows developers to share technical insights, tutorials, and best practices with a clean, responsive interface.

## 🚀 Features

- **Modern Stack**: Next.js 15 with App Router, React 19, TypeScript
- **Authentication**: Supabase Auth with secure user management
- **Rich Content**: Create and manage blog posts with featured images
- **Categorization**: Organize posts with tags and categories
- **User Profiles**: Author profiles with bio and avatar support
- **Dashboard**: Personal dashboard for content management
- **SEO Optimized**: Built-in metadata and OpenGraph support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components with proper ARIA attributes

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Components Architecture](#components-architecture)
- [Features Documentation](#features-documentation)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🛠 Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library

### Backend & Database

- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - Authentication and user management
- **Row Level Security (RLS)** - Database security policies

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Date-fns** - Date utilities

## 🗄 Database Schema

### Core Tables

#### `profiles`

User profile information linked to Supabase auth users.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `posts`

Main blog posts table with rich metadata.

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id),
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
```

#### `categories`

Content categorization system.

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `tags`

Flexible tagging system for posts.

```sql
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Junction Tables

#### `post_categories`

Many-to-many relationship between posts and categories.

```sql
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
```

#### `post_tags`

Many-to-many relationship between posts and tags.

```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

#### `post_images`

Image management for posts.

```sql
CREATE TABLE post_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Relationships

- **Users → Profiles**: One-to-one relationship via Supabase Auth
- **Profiles → Posts**: One-to-many (author relationship)
- **Posts → Categories**: Many-to-many via `post_categories`
- **Posts → Tags**: Many-to-many via `post_tags`
- **Posts → Images**: One-to-many via `post_images`

## 📁 Project Structure

```
developers-blog/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── posts/               # Post-related endpoints
│   │   │   │   ├── [id]/route.ts    # Individual post operations
│   │   │   │   └── route.ts         # Posts collection operations
│   │   │   └── profile/route.ts     # Profile operations
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── signin/page.tsx      # Sign in page
│   │   │   └── signup/page.tsx      # Sign up page
│   │   ├── authors/                 # Author profile pages
│   │   │   └── [username]/page.tsx  # Dynamic author page
│   │   ├── categories/              # Category pages
│   │   │   ├── [category]/page.tsx  # Dynamic category page
│   │   │   └── page.tsx             # Categories listing
│   │   ├── dashboard/               # User dashboard
│   │   │   ├── posts/               # Posts management
│   │   │   │   ├── edit/            # Edit existing posts
│   │   │   │   ├── new/             # Create new posts
│   │   │   │   └── page.tsx         # Posts dashboard
│   │   │   ├── profile/page.tsx     # Profile settings
│   │   │   └── page.tsx             # Dashboard home
│   │   ├── posts/                   # Blog posts
│   │   │   ├── [id]/page.tsx        # Individual post view
│   │   │   ├── not-found.tsx        # Post not found page
│   │   │   └── page.tsx             # Posts listing
│   │   ├── tags/                    # Tag pages
│   │   │   ├── [tag]/page.tsx       # Dynamic tag page
│   │   │   └── page.tsx             # Tags listing
│   │   ├── write/page.tsx           # Post creation/editing
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── not-found.tsx            # Global 404 page
│   │   └── globals.css              # Global styles
│   ├── components/                   # React Components
│   │   ├── auth/                    # Authentication components
│   │   │   ├── auth-modal.tsx       # Authentication modal
│   │   │   ├── sign-in-form.tsx     # Sign in form
│   │   │   └── sign-up-form.tsx     # Sign up form
│   │   ├── blog/                    # Blog-specific components
│   │   │   ├── hero-section.tsx     # Homepage hero
│   │   │   ├── post-card.tsx        # Post preview card
│   │   │   ├── post-content.tsx     # Post content display
│   │   │   ├── posts-grid.tsx       # Posts grid layout
│   │   │   ├── filter-sidebar.tsx   # Filtering sidebar
│   │   │   ├── categories-sidebar.tsx # Categories navigation
│   │   │   ├── tags-sidebar.tsx     # Tags navigation
│   │   │   └── related-posts.tsx    # Related posts component
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── dashboard-stats.tsx  # Analytics dashboard
│   │   │   ├── post-form.tsx        # Post creation/edit form
│   │   │   ├── posts-list.tsx       # User posts management
│   │   │   └── welcome-section.tsx  # Dashboard welcome
│   │   ├── layout/                  # Layout components
│   │   │   └── navigation.tsx       # Main navigation
│   │   ├── skeleton/                # Loading skeletons
│   │   │   ├── posts-skeleton.tsx   # Posts loading state
│   │   │   ├── dashboard-skeleton.tsx # Dashboard loading
│   │   │   └── error-components.tsx # Error boundaries
│   │   └── ui/                      # Shadcn/UI components
│   │       ├── button.tsx           # Button component
│   │       ├── card.tsx             # Card component
│   │       ├── form.tsx             # Form components
│   │       ├── input.tsx            # Input component
│   │       └── label.tsx            # Label component
│   ├── lib/                         # Utility libraries
│   │   ├── types.ts                 # TypeScript type definitions
│   │   ├── utils.ts                 # Utility functions
│   │   ├── supabase-queries.ts      # Public queries
│   │   └── supabase-dashboard-queries.ts # Protected queries
│   └── utils/                       # Utility functions
│       └── supabase/                # Supabase configuration
│           ├── client.ts            # Browser client
│           ├── server.ts            # Server client
│           └── middleware.ts        # Auth middleware
├── public/                          # Static assets
├── components.json                  # Shadcn/UI configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── docs/                            # Documentation
    ├── API_DOCUMENTATION.md         # API reference
    ├── DATABASE_SETUP.md            # Database setup guide
    ├── CONTRIBUTING.md              # Contribution guide
    └── DEPLOYMENT.md                # Deployment guide
```

## 🔌 API Routes

### Posts API (`/api/posts`)

#### `GET /api/posts`

Fetch published posts with optional filtering.

**Query Parameters:**

- `limit` (number): Maximum posts to return
- `featured` (boolean): Filter featured posts
- `author_id` (string): Filter by author
- `category` (string): Filter by category slug
- `tag` (string): Filter by tag slug

**Response:**

```typescript
{
  posts: PostWithAuthor[];
  total?: number;
}
```

#### `POST /api/posts`

Create a new post (authenticated).

**Body:**

```typescript
{
  title: string;
  content: string;
  image_url?: string;
  status: 'draft' | 'published';
  featured?: boolean;
}
```

#### `GET /api/posts/[id]`

Get a specific post by ID.

#### `PUT /api/posts/[id]`

Update a post (authenticated, author only).

#### `DELETE /api/posts/[id]`

Delete a post (authenticated, author only).

### Profile API (`/api/profile`)

#### `GET /api/profile`

Get current user's profile (authenticated).

#### `PUT /api/profile`

Update current user's profile (authenticated).

**Body:**

```typescript
{
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}
```

## 🧩 Components Architecture

### Component Categories

#### **Layout Components** (`components/layout/`)

- Global navigation and layout structure
- Responsive design with mobile-first approach
- Authentication state management

#### **Blog Components** (`components/blog/`)

- Post display and interaction components
- Content filtering and navigation
- Related content suggestions
- SEO-optimized content rendering

#### **Dashboard Components** (`components/dashboard/`)

- Content management interface
- Analytics and statistics
- User profile management
- Post creation and editing tools

#### **Auth Components** (`components/auth/`)

- Authentication forms and modals
- Secure authentication flow
- Form validation with Zod schemas

#### **UI Components** (`components/ui/`)

- Shadcn/UI based design system
- Accessible and customizable components
- Consistent styling and behavior

#### **Skeleton Components** (`components/skeleton/`)

- Loading states for better UX
- Error boundaries and fallbacks
- Consistent loading experiences

### Key Design Patterns

- **Server Components First**: Maximizing server-side rendering
- **Client Components**: Only when necessary for interactivity
- **Composition**: Building complex UIs from simple components
- **Type Safety**: Full TypeScript coverage
- **Accessibility**: ARIA attributes and semantic HTML

## 📚 Features Documentation

### Authentication System

- **Supabase Auth Integration**: Secure authentication with email/password
- **Protected Routes**: Middleware-based route protection
- **Profile Management**: Automatic profile creation and management
- **Session Handling**: Secure session management with cookies

### Content Management

- **Rich Post Editor**: Markdown support with live preview
- **Draft System**: Save drafts and publish when ready
- **Featured Posts**: Highlight important content
- **Image Upload**: Integrated image handling
- **View Counter**: Track post engagement

### Content Organization

- **Categories**: Hierarchical content organization
- **Tags**: Flexible content labeling
- **Search**: Full-text search capabilities
- **Filtering**: Multiple filtering options

### User Experience

- **Responsive Design**: Mobile-first responsive layout
- **Loading States**: Skeleton loaders for better perceived performance
- **Error Handling**: Graceful error boundaries and fallbacks
- **SEO Optimization**: Meta tags, OpenGraph, and structured data

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd developers-blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase**

   - Create a new Supabase project
   - Run the database migrations (see Database Setup section)
   - Configure authentication providers

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Required Supabase Setup

1. **Enable Authentication**

   - Go to Authentication > Settings
   - Configure email authentication
   - Set up redirect URLs

2. **Database Setup**

   - Run the SQL migrations for all tables
   - Enable Row Level Security (RLS)
   - Set up storage buckets for images

3. **RLS Policies**

   ```sql
   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
   ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

   -- Basic policies (adjust based on your requirements)
   CREATE POLICY "Users can view published posts" ON posts
     FOR SELECT USING (status = 'published');

   CREATE POLICY "Users can manage their own posts" ON posts
     FOR ALL USING (auth.uid() = author_id);
   ```

## 💻 Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### TypeScript Configuration

The project includes optimized TypeScript path mappings for better development experience:

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/types/*": ["./src/types/*"],
    "@/utils/*": ["./src/utils/*"]
  }
}
```

### Development Guidelines

1. **Code Style**

   - Follow the ESLint configuration
   - Use TypeScript strict mode
   - Implement proper error handling

2. **Component Development**

   - Use Server Components by default
   - Add 'use client' only when necessary
   - Implement proper loading states

3. **Database Queries**

   - Use the centralized query functions
   - Implement proper error handling
   - Follow RLS policies

4. **Testing**
   - Write unit tests for utility functions
   - Test component rendering
   - Validate API endpoints

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**

   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configure Environment Variables**

   - Add all environment variables in Vercel dashboard
   - Ensure Supabase URLs are production URLs

3. **Domain Configuration**
   - Set up custom domain
   - Configure redirect URLs in Supabase

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔐 Security Considerations

- **Row Level Security**: All database tables use RLS policies
- **Authentication**: Secure session management with Supabase Auth
- **Input Validation**: Zod schemas for all user inputs
- **CSRF Protection**: Built-in Next.js CSRF protection
- **XSS Prevention**: Proper sanitization of user content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Development Standards

- Follow TypeScript strict mode
- Implement proper error handling
- Add tests for new features
- Update documentation as needed
- Follow the established project structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) - Component library
- [Radix UI](https://radix-ui.com/) - UI primitives

---

**Built with ❤️ by the DevBlog Team**
