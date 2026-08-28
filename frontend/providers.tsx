'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth-context';
import { queryClient } from './lib/query-client';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
