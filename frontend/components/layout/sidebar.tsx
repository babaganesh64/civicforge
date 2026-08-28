'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-hooks';
import { LogOut, LayoutDashboard, Flag, UserCircle, LifeBuoy } from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
    { name: 'Challenges', href: '/challenges', icon: <Flag className="w-4 h-4 mr-3" /> },
    { name: 'Profile', href: '/profile', icon: <UserCircle className="w-4 h-4 mr-3" /> },
    { name: 'Support', href: '/support', icon: <LifeBuoy className="w-4 h-4 mr-3" /> }
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-sm z-10">
      <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800">
        <span className="text-blue-600 mr-1">❖</span> CivicForge
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === item.href 
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="mb-3 px-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.displayName}</div>
          <div className="text-xs text-slate-500 truncate capitalize">{user?.userType?.replace(/_/g, ' ').toLowerCase()}</div>
        </div>
        <button 
          onClick={logout} 
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
