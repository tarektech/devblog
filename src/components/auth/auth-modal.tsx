'use client';

import { useState } from 'react';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';

interface AuthModalProps {
  initialMode?: 'signin' | 'signup';
  onClose?: () => void;
}

export function AuthModal({ initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {mode === 'signin' ? (
        <SignInForm onToggleMode={toggleMode} />
      ) : (
        <SignUpForm onToggleMode={toggleMode} />
      )}
    </div>
  );
}
