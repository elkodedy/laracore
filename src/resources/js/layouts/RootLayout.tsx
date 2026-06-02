import React, { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { initializeApiClient, queryClient } from '../api';

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root application layout
 *
 * Wraps the entire app with necessary providers:
 * - QueryClientProvider: Manages server state
 * - CSRF token injection for API calls
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // Initialize API client on first render
  React.useEffect(() => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    initializeApiClient('/api', token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
