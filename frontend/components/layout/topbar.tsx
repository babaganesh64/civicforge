'use client';

import { NotificationBell } from './notification-bell';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Search } from 'lucide-react';

export function Topbar() {
  return (
    <div className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
      <div className="hidden md:flex items-center gap-3 text-sm text-slate-500"><div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400"><Search className="h-4 w-4" /><span>Search challenges, projects…</span><kbd className="ml-12 rounded border bg-white px-1.5 text-[10px]">⌘ K</kbd></div></div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell />
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
        <Link href="/profile" className="flex items-center gap-3 group">
          <div className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">My Profile</div>
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            U
          </div>
        </Link>
      </div>
    </div>
  );
}
