import { AuthModal } from '@/components/auth/auth-modal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | DevBlog',
  description:
    'Sign in to your DevBlog account to access your dashboard and manage your content.',
};

export default function SignInPage() {
  return <AuthModal initialMode="signin" />;
}
