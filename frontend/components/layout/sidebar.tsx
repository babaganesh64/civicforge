'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-hooks';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Challenges', href: '/challenges' },
    { name: 'Profile', href: '/profile' }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 font-bold text-xl border-b border-gray-800">
        CivicForge
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded ${pathname === item.href ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="mb-2 text-sm text-gray-400">{user?.displayName}</div>
        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}
