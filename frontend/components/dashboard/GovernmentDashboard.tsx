import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { useChallenges } from '@/hooks/useChallenges';
import { ChallengeStatus } from '@/types/challenge';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardCharts } from '@/components/dashboard-charts';
import { FileText, Clock, ShieldCheck, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function GovernmentDashboard() {
  const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics();
  // Fetch pending review challenges for the table
  const { data: recentChallengesPage, isLoading: isChallengesLoading } = useChallenges({ status: ChallengeStatus.SUBMITTED, size: 5 });
  const recentChallenges = recentChallengesPage?.content || [];

  return (
    <div className="space-y-6">
      {/* Metrics Row 1 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Total Challenges</CardTitle>
            <div className="p-1.5 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.totalChallenges || 0}</div>}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Review</CardTitle>
            <div className="p-1.5 bg-amber-100 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.pendingReview || 0}</div>}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Verified</CardTitle>
            <div className="p-1.5 bg-indigo-100 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">0</div>}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle>
            <div className="p-1.5 bg-purple-100 rounded-lg">
                <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{metrics?.activeProjects || 0}</div>}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Resolved</CardTitle>
            <div className="p-1.5 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isMetricsLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">0</div>}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Layer */}
      <DashboardCharts />

      {/* Recent Challenges Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
             <CardTitle>Recent Challenges requiring Review</CardTitle>
             <CardDescription>A list of recently submitted challenges that have not been verified.</CardDescription>
          </div>
          <Link href="/challenges">
            <Button variant="outline" size="sm">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isChallengesLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading recent challenges...</TableCell>
                </TableRow>
              ) : recentChallenges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">No challenges currently require review.</TableCell>
                </TableRow>
              ) : (
                recentChallenges.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell className="font-medium text-slate-500">#{challenge.referenceNumber}</TableCell>
                    <TableCell className="font-medium">{challenge.title}</TableCell>
                    <TableCell>{challenge.category || 'Uncategorized'}</TableCell>
                    <TableCell>
                      {challenge.priority === 'HIGH' ? <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge> : 
                       challenge.priority === 'MEDIUM' ? <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge> :
                       challenge.priority === 'LOW' ? <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge> :
                       <Badge variant="outline">Unassigned</Badge>}
                    </TableCell>
                    <TableCell>
                       <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{challenge.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {challenge.submittedAt ? formatDistanceToNow(new Date(challenge.submittedAt), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/challenges/${challenge.id}`} className="text-blue-600 hover:underline text-sm font-medium">Review</Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
