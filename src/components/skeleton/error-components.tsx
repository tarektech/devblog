'use client';

import React from 'react';

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  actionButton,
}: {
  title?: string;
  message: string;
  actionButton?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      {actionButton}
    </div>
  );
}

export function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Dashboard</h1>
        <ErrorMessage
          title="Failed to load dashboard"
          message={message}
          actionButton={
            onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            )
          }
        />
      </div>
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      'Dashboard Error Boundary caught an error:',
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <DashboardError
          message="An unexpected error occurred while loading the dashboard. Please refresh the page or try again later."
          onRetry={() => {
            this.setState({ hasError: false });
            window.location.reload();
          }}
        />
      );
    }

    return this.props.children;
  }
}
