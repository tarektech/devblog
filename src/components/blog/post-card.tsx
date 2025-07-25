import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PostWithAuthor } from '@/lib/types';

interface PostCardProps {
  post: PostWithAuthor;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Use ID for now since slug column doesn't exist in database yet
  const postUrl = `/posts/${post.id}`;

  return (
    <Link href={postUrl}>
      <Card
        className={`h-full hover:shadow-lg transition-shadow duration-200 group ${
          featured ? 'border-orange-600/20' : ''
        }`}
      >
        {post.image_url && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {featured && (
              <div className="absolute top-3 left-3">
                <span className="bg-orange-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        <CardHeader className="pb-3">
          <CardTitle
            className={`line-clamp-2 group-hover:text-orange-600 transition-colors ${
              featured ? 'text-lg' : 'text-base'
            }`}
          >
            {post.title}
          </CardTitle>
          {post.content && (
            <CardDescription className="line-clamp-3">
              {post.content}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              {post.profiles?.display_name && (
                <span>By {post.profiles.display_name}</span>
              )}
            </div>
            {formattedDate && (
              <time dateTime={post.published_at!}>{formattedDate}</time>
            )}
          </div>
          {post.view_count !== null && post.view_count > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {post.view_count} {post.view_count === 1 ? 'view' : 'views'}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
