# API Documentation

This document provides detailed information about all API endpoints in the Developers Blog platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

Most endpoints require authentication. The application uses Supabase Auth with JWT tokens stored in HTTP-only cookies.

### Authentication Headers

For authenticated requests, the JWT token is automatically included via cookies. No manual header configuration is needed for browser requests.

## Response Format

API responses use different formats depending on the endpoint:

```typescript
// Success Response (Posts)
{
  id: string,
  title: string,
  // ... other post fields
}

// Success Response (Profile)
{
  profile: {
    id: string,
    display_name: string,
    // ... other profile fields
  }
}

// Error Response
{
  message: string
}
```

## Endpoints

### Posts API

#### Get All Posts

**Note**: Currently not implemented as an API endpoint. Published posts are fetched server-side using the `getPublishedPosts()` function from `@/lib/supabase-queries`. For client-side fetching, you would need to implement this endpoint or use the existing server-side functions in your page components.

**Alternative - Server-side Data Fetching:**

```typescript
import {
  getPublishedPosts,
  getFeaturedPosts,
  getRecentPosts,
} from '@/lib/supabase-queries';

// Get all published posts
const posts = await getPublishedPosts(limit);

// Get featured posts
const featuredPosts = await getFeaturedPosts(3);

// Get recent posts (excluding featured)
const recentPosts = await getRecentPosts(6);
```

#### Get Single Post (For Editing)

```http
GET /api/posts/[id]
```

Retrieves a single post by ID for editing purposes. **Requires authentication** and the user must be the author of the post.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Post UUID   |

**Example Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Getting Started with Next.js 15",
  "content": "In this post, we'll explore...",
  "image_url": "https://example.com/image.jpg",
  "status": "draft",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "published_at": null,
  "view_count": 0,
  "featured": false,
  "author_id": "456e7890-e89b-12d3-a456-426614174001"
}
```

**Error Response:**

```json
{
  "message": "Post not found or access denied"
}
```

**Note**: For public post viewing with full details (including tags and categories), use the server-side `getPostById()` function from `@/lib/supabase-queries` in your page components.

#### Create Post

```http
POST /api/posts
```

Creates a new blog post. Requires authentication.

**Request Body:**

```json
{
  "title": "My New Post",
  "content": "Post content in markdown format...",
  "image_url": "https://example.com/image.jpg",
  "status": "draft",
  "featured": false
}
```

**Response:**

```json
{
  "id": "new-post-id",
  "title": "My New Post",
  "content": "Post content in markdown format...",
  "status": "draft",
  "author_id": "current-user-id",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Update Post

```http
PUT /api/posts/[id]
```

Updates an existing post. Requires authentication and ownership.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Post UUID   |

**Request Body:** (All fields optional)

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "image_url": "https://example.com/new-image.jpg",
  "status": "published",
  "featured": true
}
```

#### Delete Post

```http
DELETE /api/posts/[id]
```

Deletes a post. Requires authentication and ownership.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `id`      | string | Post UUID   |

**Response:**

```json
{
  "message": "Post deleted successfully"
}
```

### Profile API

#### Get Current User Profile

```http
GET /api/profile
```

Retrieves the current authenticated user's profile.

**Response:**

```json
{
  "profile": {
    "id": "user-id",
    "display_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Full-stack developer passionate about React and Node.js",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Update User Profile

```http
PUT /api/profile
```

Updates the current user's profile. Requires authentication.

**Request Body:** (All fields optional)

```json
{
  "display_name": "John Smith",
  "bio": "Updated bio...",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**Response:**

```json
{
  "profile": {
    "id": "user-id",
    "display_name": "John Smith",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "bio": "Updated bio...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Categories API

**Note**: Currently not implemented as API endpoints. Categories are fetched server-side using functions from `@/lib/supabase-queries`.

**Available Server-side Functions:**

```typescript
import { getAllCategories, getCategoryBySlug } from '@/lib/supabase-queries';

// Get all categories
const categories = await getAllCategories();

// Get category by slug
const category = await getCategoryBySlug('javascript');
```

### Tags API

**Note**: Currently not implemented as API endpoints. Tags are fetched server-side using functions from `@/lib/supabase-queries`.

**Available Server-side Functions:**

```typescript
import { getAllTags, getTagBySlug } from '@/lib/supabase-queries';

// Get all tags
const tags = await getAllTags();

// Get tag by slug
const tag = await getTagBySlug('react');
```

## Error Handling

### HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Common Error Messages

| Error                             | Description                         | Solution                     |
| --------------------------------- | ----------------------------------- | ---------------------------- |
| "Profile not found"               | User profile doesn't exist          | Complete profile setup       |
| "Post not found or access denied" | Post doesn't exist or no permission | Check post ID and ownership  |
| "Internal server error"           | Server-side error occurred          | Try again or contact support |
| Invalid JSON in request body      | Malformed request data              | Check request format         |

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended to:

- Limit post creation to 10 per hour per user
- Limit profile updates to 5 per hour per user
- Implement general API rate limiting in production

## Implementation Notes

### Server-Side vs API Approach

This application primarily uses **server-side data fetching** rather than client-side API calls for public data. This approach provides several benefits:

- **Better SEO**: Content is rendered on the server
- **Faster Initial Load**: No client-side API calls needed
- **Better UX**: Content appears immediately
- **Simpler Caching**: Leverages Next.js built-in caching

**When to use API endpoints:**

- User-specific actions (create, update, delete posts)
- Profile management
- Dashboard functionality

**When to use server-side functions:**

- Public content display
- Static page generation
- SEO-critical pages

## Examples

### Create and Publish a Post

```javascript
// Create draft
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My Amazing Post',
    content: 'This is the content...',
    status: 'draft',
  }),
});

const { data: post } = await response.json();

// Publish the post
await fetch(`/api/posts/${post.id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'published',
  }),
});
```

### Get Posts with Filtering

```javascript
// Get featured posts
const featuredPosts = await fetch('/api/posts?featured=true&limit=3');

// Get posts by category
const categoryPosts = await fetch('/api/posts?category=javascript&limit=10');

// Get posts by author
const authorPosts = await fetch('/api/posts?author_id=user-123');
```

### Update User Profile

```javascript
const response = await fetch('/api/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    display_name: 'New Display Name',
    bio: 'Updated bio text',
  }),
});

const { data: profile } = await response.json();
```

## Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints:

```bash
# Get all posts
curl -X GET "http://localhost:3000/api/posts"

# Get single post
curl -X GET "http://localhost:3000/api/posts/post-id"

# Create post (requires authentication cookie)
curl -X POST "http://localhost:3000/api/posts" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Test content","status":"draft"}'
```

## SDK/Client Libraries

Consider creating client libraries for common languages:

- JavaScript/TypeScript client
- Python client
- Go client

This would provide type-safe API access and better developer experience.

For more information, see the main [README.md](../README.md) file.
