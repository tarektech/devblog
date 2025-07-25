import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PostNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
            Post Not Found
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            This blog post does not exist
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            The blog post you are looking for might have been removed,
            unpublished, or the URL might be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/posts">
            <Button size="lg" className="text-lg px-8">
              Browse All Posts
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Go Home
            </Button>
          </Link>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4">What you can do:</h3>
          <ul className="text-left text-muted-foreground space-y-2">
            <li>• Check the URL for any typos</li>
            <li>• Browse our latest posts</li>
            <li>• Use the search functionality</li>
            <li>• Return to the homepage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
