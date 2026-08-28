'use client';
import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
}

interface BulkToolbarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  className?: string;
}

export function BulkToolbar({ selectedCount, actions, onClear, className }: BulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl border bg-background px-4 py-3 shadow-lg ring-1 ring-border',
        className
      )}
      role="toolbar"
      aria-label="Bulk actions toolbar"
    >
      {/* Selection count */}
      <span className="mr-2 text-sm font-semibold text-foreground">
        {selectedCount.toLocaleString()} selected
      </span>

      <div className="h-4 w-px bg-border" />

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant ?? 'ghost'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className="h-8 gap-1.5 text-sm"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Clear */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        className="h-8 w-8 text-muted-foreground"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
