import Link from 'next/link';
import { getCurrentUserPosts } from '@/lib/supabase-dashboard-queries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { DeletePostButton } from './delete-post-button';

export async function PostsList() {
  const posts = await getCurrentUserPosts();

  if (posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          You haven&apos;t created any posts yet. Start sharing your knowledge
          with the developer community!
        </p>
        <Link href="/write">
          <Button size="lg">Create Your First Post</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  {post.featured && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="text-muted-foreground mb-3 line-clamp-2">
                {post.content.length > 200
                  ? post.content.substring(0, 200) + '...'
                  : post.content.substring(0, 150) + '...'}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {post.created_at && (
                  <span>
                    Created{' '}
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                {post.published_at && (
                  <span>
                    Published{' '}
                    {formatDistanceToNow(new Date(post.published_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
                {post.view_count !== null && post.view_count > 0 && (
                  <span>{post.view_count.toLocaleString()} views</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {post.status === 'published' && (
                <Link href={`/posts/${post.id}`} target="_blank">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              )}
              <Link href={`/dashboard/posts/edit/${post.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              <DeletePostButton postId={post.id} postTitle={post.title} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
