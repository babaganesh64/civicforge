'use client';

import { useAuth } from '@/lib/auth-hooks';
import { useMyOrganizations } from '@/hooks/useOrganizations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/common/kpi-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: organizations, isLoading: isLoadingOrgs, error: orgsError } = useMyOrganizations();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.displayName}!</h1>
        <p className="text-gray-500">
          Here's an overview of your account and organizations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Account Status"
          value={user.status}
          description={`Verified: ${user.identityVerified ? 'Yes' : 'No'}`}
        />
        <KpiCard
          label="Account Type"
          value={user.userType.replace(/_/g, ' ')}
        />
        <KpiCard
          label="Active Challenges"
          value="Coming Soon"
          description="Platform feature"
        />
        <KpiCard
          label="Your Submissions"
          value="0"
          description="Awaiting first submission"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Organizations</h2>
        
        {isLoadingOrgs ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : orgsError ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            Failed to load organizations.
          </div>
        ) : organizations && organizations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{org.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{org.type.replace(/_/g, ' ')}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {org.description || 'No description provided.'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No organizations found</h3>
              <p className="text-sm text-gray-500">
                You are not a member of any organization yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
