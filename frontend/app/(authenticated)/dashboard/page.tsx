'use client';

import { useAuth } from '@/lib/auth-hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { DashboardCharts } from '@/components/dashboard-charts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle } from 'lucide-react';

function CitizenDashboard() {
  const { data: metrics, isLoading } = useDashboardMetrics();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">My Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.totalChallenges || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">0</div>}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4">
        <Link href="/challenges/new">
          <Button>Submit a New Challenge</Button>
        </Link>
        <Link href="/challenges">
          <Button variant="outline">View My Submissions</Button>
        </Link>
      </div>
    </div>
  );
}

function GovernmentDashboard() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.totalChallenges || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.pendingReview || 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.activeProjects || 0}</div>}
          </CardContent>
        </Card>
      </div>
      
      <DashboardCharts />
    </div>
  );
}

function OrganizationDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Collaborations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Proposals Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Discover Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">Find verified civic challenges to tackle.</p>
            <Link href="/challenges">
              <Button size="sm" className="w-full gap-2">Browse Challenges <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const userRole = (user as any).role || user.userType || '';
  const isGovernment = userRole.includes('GOVERNMENT');
  const isUniversity = userRole.includes('UNIVERSITY');
  const isIndustry = userRole.includes('INDUSTRY');
  
  let DashboardContent = CitizenDashboard;
  if (isGovernment) {
    DashboardContent = GovernmentDashboard;
  } else if (isUniversity || isIndustry) {
    DashboardContent = OrganizationDashboard;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Welcome back, {user.displayName}!</h1>
        <p className="text-slate-500 text-lg">
          Here&apos;s an overview of your account activity.
        </p>
      </div>

      <DashboardContent />
    </div>
  );
}
