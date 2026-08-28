'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/lib/auth-hooks';
import { useSubmitBulkJob } from '@/hooks/useBulkOperations';
import { UserRole } from '@/types/user';
import { ChallengeStatus, ChallengePriority, ChallengeListItem } from '@/types/challenge';
import { ChallengeFilterBar } from '@/components/challenges/challenge-filter-bar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-table/data-table';
import { BulkToolbar } from '@/components/data-table/bulk-toolbar';
import { StatusBadge } from '@/components/common/status-badge';
import { BulkProgressDrawer } from '@/components/bulk/bulk-progress-drawer';
import { Plus, MoreHorizontal, Eye, CheckCircle, Archive, Send, FileEdit, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChallengesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    priority: searchParams.get('priority') || '',
  });

  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));
  const [size, setSize] = useState(parseInt(searchParams.get('size') || '20', 10));

  const [rowSelection, setRowSelection] = useState({});
  const [bulkJobId, setBulkJobId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.category) params.set('category', filters.category);
    if (filters.priority) params.set('priority', filters.priority);
    params.set('page', page.toString());
    params.set('size', size.toString());
    router.replace(`/challenges?${params.toString()}`, { scroll: false });
  }, [filters, page, size, router]);

  const { data, isLoading, error } = useChallenges({
    ...filters,
    status: filters.status as ChallengeStatus,
    priority: filters.priority as ChallengePriority,
    page,
    size,
  });

  const submitBulkJob = useSubmitBulkJob();

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const isCitizen = user?.userType === UserRole.CITIZEN;
  const isGovernment = [UserRole.GOVERNMENT_REVIEWER, UserRole.GOVERNMENT_MANAGER].includes(user?.userType as UserRole);

  const columns: ColumnDef<ChallengeListItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'referenceNumber',
      header: 'Reference #',
      cell: ({ row }) => (
        <Link href={`/challenges/${row.original.id}`} className="font-mono text-sm text-primary hover:underline">
          {row.getValue('referenceNumber')}
        </Link>
      )
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const title = row.getValue('title') as string;
        return (
          <Link href={`/challenges/${row.original.id}`} className="hover:underline" title={title}>
            {title.length > 60 ? title.substring(0, 60) + '...' : title}
          </Link>
        );
      }
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => `${row.original.city}, ${row.original.stateProvince}`
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority') as string;
        if (!priority) return null;
        return <Badge variant={priority === 'CRITICAL' ? 'destructive' : priority === 'HIGH' ? 'default' : 'secondary'}>{priority}</Badge>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status') as ChallengeStatus} />
    },
    {
      accessorKey: 'submittedAt',
      header: 'Submitted',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.getValue('submittedAt')), { addSuffix: true })}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/challenges/${row.original.id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              {isGovernment && (
                <DropdownMenuItem asChild>
                  <Link href={`/challenges/${row.original.id}/review`} className="flex items-center cursor-pointer">
                    <CheckCircle className="mr-2 h-4 w-4" /> Review Challenge
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  if (!isGovernment) {
    columns.shift(); // Remove checkbox column for non-gov
  }

  const selectedCount = Object.keys(rowSelection).length;
  const selectedRows = data?.content.filter((_, idx) => (rowSelection as Record<string, boolean>)[idx]) || [];

  const handleBulkAction = async (operationType: string, params?: Record<string, any>) => {
    const itemIds = selectedRows.map(r => r.id);
    if (itemIds.length === 0) return;
    
    try {
      const response = await submitBulkJob.mutateAsync({
        operationType,
        itemIds,
        parameters: params
      });
      setBulkJobId(response.id);
    } catch (err) {
      console.error("Bulk job submission failed", err);
      alert("Failed to submit bulk operation.");
    }
  };

  const handleDrawerClose = () => {
    setBulkJobId(null);
    setRowSelection({});
    queryClient.invalidateQueries({ queryKey: ['challenges'] });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Challenges</h2>
          <p className="text-muted-foreground">
            {isCitizen ? 'Your submissions' : 'Review queue'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isCitizen && (
            <Button asChild>
              <Link href="/challenges/new">
                <Plus className="mr-2 h-4 w-4" /> Submit Challenge
              </Link>
            </Button>
          )}
        </div>
      </div>

      <ChallengeFilterBar filters={filters} onChange={handleFilterChange} />

      {selectedCount > 0 && isGovernment && (
        <BulkToolbar 
          selectedCount={selectedCount}
          onClear={() => setRowSelection({})}
          actions={[
            { 
              label: 'Publish Selected', 
              onClick: () => handleBulkAction('PUBLISH'), 
              icon: <Send className="w-4 h-4 mr-2" /> 
            },
            { 
              label: 'Change Status', 
              onClick: () => {
                const newStatus = prompt("Enter new status (e.g. IN_PROGRESS, RESOLVED):");
                if (newStatus) {
                  handleBulkAction('CHANGE_STATUS', { status: newStatus });
                }
              }, 
              icon: <FileEdit className="w-4 h-4 mr-2" /> 
            },
            { 
              label: 'Assign Organization', 
              onClick: () => {
                const orgId = prompt("Enter Organization ID to assign:");
                if (orgId) {
                  handleBulkAction('ASSIGN_ORGANIZATION', { organizationId: orgId });
                }
              }, 
              icon: <Users className="w-4 h-4 mr-2" /> 
            }
          ]}
        />
      )}

      {error ? (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
          Failed to load challenges. Please try again later.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.content || []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          pagination={{ pageIndex: page, pageSize: size }}
          onPaginationChange={(updater) => {
            const nextState = typeof updater === 'function' ? updater({ pageIndex: page, pageSize: size }) : updater;
            setPage(nextState.pageIndex);
            setSize(nextState.pageSize);
          }}
          totalElements={data?.totalElements || 0}
          totalPages={data?.totalPages || 0}
        />
      )}

      <BulkProgressDrawer 
        jobId={bulkJobId} 
        onClose={handleDrawerClose} 
      />
    </div>
  );
}
