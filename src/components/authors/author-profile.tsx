import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAuthorByDisplayName,
  getPostsByAuthor,
} from '@/lib/supabase-queries';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';

interface AuthorProfileProps {
  username: string;
}

export async function AuthorProfile({ username }: AuthorProfileProps) {
  try {
    const decodedUsername = decodeURIComponent(username);

    // First fetch the author
    const author = await getAuthorByDisplayName(decodedUsername);

    if (!author) {
      notFound();
    }

    // Then fetch posts using the author ID
    const posts = await getPostsByAuthor(author.id);

    return (
      <div>
        {/* Author Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.display_name || 'Author'}
                width={120}
                height={120}
                className="rounded-full mx-auto border-4 border-orange-500/20"
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-orange-500/20 mx-auto flex items-center justify-center">
                <span className="text-4xl font-bold text-orange-500">
                  {(author.display_name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {author.display_name || 'Anonymous Author'}
          </h1>

          {author.bio && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              {author.bio}
            </p>
          )}

          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <span>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
            </span>
            {author.created_at && (
              <span>
                Member since {new Date(author.created_at).getFullYear()}
              </span>
            )}
          </div>
        </div>

        {/* Author's Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-8">
            Posts by {author.display_name || 'this author'}
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-4">No posts yet</h3>
              <p className="text-muted-foreground mb-8">
                This author has not published any posts yet.
              </p>
              <Link href="/posts">
                <Button>Browse All Posts</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in AuthorProfile component:', error);
    notFound();
  }
}
