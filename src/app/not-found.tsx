import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-orange-500 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="text-lg px-8">
              Go Home
            </Button>
          </Link>
          <Link href="/posts">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Browse Posts
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-orange-500 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
