import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SmartWriteButton } from './smart-write-button';

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-orange-600/5" />

      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to <span className="text-orange-600">DevBlog</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover the latest insights, tutorials, and best practices from the
          developer community. Share your knowledge and learn from fellow
          developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/posts">
            <Button size="lg" className="text-lg px-8">
              Explore Posts
            </Button>
          </Link>

          <SmartWriteButton
            variant="outline"
            size="lg"
            className="text-lg px-8"
          />
        </div>
      </div>
    </section>
  );
}
