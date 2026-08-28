'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth-context';
import { queryClient } from './lib/query-client';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
