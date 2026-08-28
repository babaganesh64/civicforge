import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: ReactNode;
  description?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export function KpiCard({
  label,
  value,
  trend,
  icon,
  description,
  onClick,
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  const isPositiveTrend = trend?.startsWith('+');
  const isNegativeTrend = trend?.startsWith('-');

  return (
    <Card 
      className={`overflow-hidden transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-gray-500 tracking-tight">{label}</p>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <div className="flex items-baseline space-x-3">
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          {trend && (
            <span
              className={`text-sm font-medium ${
                isPositiveTrend ? 'text-green-600' : isNegativeTrend ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
