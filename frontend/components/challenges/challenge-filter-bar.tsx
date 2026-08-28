import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';
import { ChallengeStatus, ChallengePriority } from '@/types/challenge';

interface FilterState {
  search: string;
  status: string;
  category: string;
  priority: string;
}

interface ChallengeFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ChallengeFilterBar({ filters, onChange }: ChallengeFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onChange({ ...filters, search: localSearch });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, filters, onChange]);

  const removeFilter = (key: keyof FilterState) => {
    onChange({ ...filters, [key]: '' });
    if (key === 'search') setLocalSearch('');
  };

  const clearAll = () => {
    setLocalSearch('');
    onChange({ search: '', status: '', category: '', priority: '' });
  };

  const hasFilters = filters.search || filters.status || filters.category || filters.priority;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filters.status} onValueChange={(val) => onChange({ ...filters, status: val === 'ALL' ? '' : val })}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(ChallengeStatus).map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.category} onValueChange={(val) => onChange({ ...filters, category: val === 'ALL' ? '' : val })}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {['Infrastructure', 'Health', 'Education', 'Environment', 'Safety', 'Agriculture', 'Transportation', 'Other'].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={(val) => onChange({ ...filters, priority: val === 'ALL' ? '' : val })}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            {Object.values(ChallengePriority).map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground mr-1">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1 px-2 py-1">
              Search: {filters.search}
              <button onClick={() => removeFilter('search')}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1 px-2 py-1">
              Status: {filters.status.replace(/_/g, ' ')}
              <button onClick={() => removeFilter('status')}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1 px-2 py-1">
              Category: {filters.category}
              <button onClick={() => removeFilter('category')}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary" className="gap-1 px-2 py-1">
              Priority: {filters.priority}
              <button onClick={() => removeFilter('priority')}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs">Clear all</Button>
        </div>
      )}
    </div>
  );
}
