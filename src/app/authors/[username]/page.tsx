import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAuthorByDisplayName } from '@/lib/supabase-queries';
import { AuthorProfile } from '@/components/authors/author-profile';
import { AuthorProfileSkeleton } from '@/components/skeleton';

interface Props {
  params: Promise<{ username: string }> ;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const author = await getAuthorByDisplayName(
    decodeURIComponent(username)  
  );

  if (!author) {
    return {
      title: 'Author Not Found | DevBlog',
      description: 'The requested author profile could not be found.',
    };
  }

  return {
    title: `${author.display_name || 'Author'} | DevBlog`,
    description:
      author.bio ||
      `Read articles and tutorials by ${
        author.display_name || 'this author'
      } on DevBlog.`,
    openGraph: {
      title: `${author.display_name || 'Author'} | DevBlog`,
      description:
        author.bio ||
        `Read articles and tutorials by ${
          author.display_name || 'this author'
        }.`,
      type: 'profile',
      images: author.avatar_url
        ? [{ url: author.avatar_url, alt: author.display_name || 'Author' }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${author.display_name || 'Author'} | DevBlog`,
      description:
        author.bio ||
        `Read articles and tutorials by ${
          author.display_name || 'this author'
        }.`,
      images: author.avatar_url ? [author.avatar_url] : undefined,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { username } = await params;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<AuthorProfileSkeleton />}>
            <AuthorProfile username={username} />
        </Suspense>
      </div>
    </div>
  );
}
