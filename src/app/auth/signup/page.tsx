import { AuthModal } from '@/components/auth/auth-modal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | DevBlog',
  description:
    'Create your DevBlog account to start publishing and sharing your technical knowledge.',
};

export default function SignUpPage() {
  return <AuthModal initialMode="signup" />;
}
