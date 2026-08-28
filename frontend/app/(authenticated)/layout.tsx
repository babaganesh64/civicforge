'use client';

import React from 'react';
import { useRequireAuth } from '@/lib/auth-hooks';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/lib/auth-hooks';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useRequireAuth();
  const { user } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return <AppShell userRole={user.userType}>{children}</AppShell>;
}
