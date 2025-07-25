import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import ReactPlugin from '@stagewise-plugins/react';
import { Navigation } from '@/components/layout/navigation';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DevBlog | Share Your Developer Knowledge',
  description:
    'A modern developer blog platform for sharing technical insights, tutorials, and best practices. Join our community of developers and share your expertise.',
  keywords: ['developer blog', 'programming', 'tutorials', 'tech', 'coding'],
  authors: [{ name: 'DevBlog Team' }],
  openGraph: {
    title: 'DevBlog | Share Your Developer Knowledge',
    description:
      'A modern developer blog platform for sharing technical insights, tutorials, and best practices.',
    type: 'website',
    siteName: 'DevBlog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevBlog | Share Your Developer Knowledge',
    description:
      'A modern developer blog platform for sharing technical insights, tutorials, and best practices.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <Navigation />
        <main className="flex-1">{children}</main>
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
        )}
      </body>
    </html>
  );
}
