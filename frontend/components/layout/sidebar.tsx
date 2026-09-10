'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-hooks';
import { LogOut, LayoutDashboard, Flag, UserCircle, LifeBuoy, FolderKanban, Building2, BarChart3, Bell } from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const userRole = (user as any)?.role || user?.userType || '';
  const isGovernment = userRole.includes('GOVERNMENT') || userRole.includes('ADMIN');
  const isPartner = userRole.includes('UNIVERSITY') || userRole.includes('INDUSTRY');

  let navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
    { name: 'Challenges', href: '/challenges', icon: <Flag className="w-4 h-4 mr-3" /> },
    { name: 'Profile', href: '/profile', icon: <UserCircle className="w-4 h-4 mr-3" /> },
    { name: 'Support', href: '/support', icon: <LifeBuoy className="w-4 h-4 mr-3" /> }
  ];

  if (isGovernment) {
    navItems = [
      { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
      { name: 'Challenges', href: '/challenges', icon: <Flag className="w-4 h-4 mr-3" /> },
      { name: 'Projects', href: '/projects', icon: <FolderKanban className="w-4 h-4 mr-3" /> },
      { name: 'Organizations', href: '/organizations', icon: <Building2 className="w-4 h-4 mr-3" /> },
      { name: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4 mr-3" /> },
      { name: 'Notifications', href: '/notifications', icon: <Bell className="w-4 h-4 mr-3" /> },
      { name: 'Profile', href: '/profile', icon: <UserCircle className="w-4 h-4 mr-3" /> }
    ];
  } else if (isPartner) {
    navItems = [
      { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
      { name: 'Challenge Desk', href: '/challenges', icon: <Flag className="w-4 h-4 mr-3" /> },
      { name: 'Marketplace', href: '/marketplace', icon: <Building2 className="w-4 h-4 mr-3" /> },
      { name: 'Profile', href: '/profile', icon: <UserCircle className="w-4 h-4 mr-3" /> },
      { name: 'Support', href: '/support', icon: <LifeBuoy className="w-4 h-4 mr-3" /> }
    ];
  }

  return (
    <div className="w-64 bg-[#071d36] text-slate-100 flex flex-col h-full shadow-xl shadow-slate-950/10 z-20">
      <div className="h-20 flex items-center px-5 border-b border-white/10">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-900/40">CF</div>
        <div className="ml-3"><div className="font-bold text-lg tracking-tight leading-none">CivicForge</div><div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Civic innovation</div></div>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-blue-200/55 uppercase tracking-[0.16em] mb-4 px-2">Workspace</div>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-950/20'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="mb-3 px-2">
          <div className="text-sm font-semibold text-white truncate">{user?.displayName}</div>
          <div className="text-xs text-blue-200/65 truncate capitalize">{user?.userType?.replace(/_/g, ' ').toLowerCase()}</div>
        </div>
        <button 
          onClick={logout} 
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
