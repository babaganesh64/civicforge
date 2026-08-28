'use client';

import { NotificationBell } from './notification-bell';

export function Topbar() {
  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="font-semibold text-gray-800">CivicForge</div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          U
        </div>
      </div>
    </div>
  );
}
