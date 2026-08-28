'use client';
import { cn } from '@/lib/utils';
import { ChallengePriority } from '@/types/challenge';

export function PriorityBadge({ priority }: { priority: ChallengePriority }) {
  const getBadgeColor = () => {
    switch (priority) {
      case ChallengePriority.CRITICAL: return 'bg-red-100 text-red-800';
      case ChallengePriority.HIGH: return 'bg-orange-100 text-orange-800';
      case ChallengePriority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case ChallengePriority.LOW: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', getBadgeColor())}>
      {priority}
    </span>
  );
}
