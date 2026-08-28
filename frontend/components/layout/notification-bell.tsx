import React from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/use-notifications';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const router = useRouter();

  const handleNotificationClick = (id: string, targetUrl?: string) => {
    markAsRead.mutate(id);
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 cursor-pointer gap-1 focus:bg-gray-50"
                onClick={() => handleNotificationClick(notification.id, notification.targetUrl)}
              >
                <div className="flex items-center gap-2 w-full">
                  {!notification.readAt && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm text-gray-900">{notification.title}</span>
                </div>
                <span className="text-sm text-gray-500 line-clamp-2 pl-4">
                  {notification.message}
                </span>
                <span className="text-xs text-gray-400 pl-4 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
