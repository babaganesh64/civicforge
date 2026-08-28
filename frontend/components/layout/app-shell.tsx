'use client';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { useRequireAuth } from '@/lib/auth-hooks';

export function AppShell({ children, userRole }: { children: React.ReactNode, userRole: string }) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading || !isAuthenticated) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
