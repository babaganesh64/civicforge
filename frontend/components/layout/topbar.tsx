'use client';

import { NotificationBell } from './notification-bell';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export function Topbar() {
  return (
    <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="font-semibold text-slate-800 dark:text-slate-200 text-lg"></div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell />
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
        <Link href="/profile" className="flex items-center gap-3 group">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">My Profile</div>
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            U
          </div>
        </Link>
      </div>
    </div>
  );
}
