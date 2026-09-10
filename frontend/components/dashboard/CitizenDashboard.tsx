import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from '@/hooks/use-dashboard-metrics';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/lib/auth-hooks';
import { PlusCircle, FileText, CheckCircle2, AlertCircle, MapPin, Activity, Bell, FileSearch, HelpCircle } from 'lucide-react';
import { StatusBadge } from '@/components/common/status-badge';
import { formatDistanceToNow } from 'date-fns';

export function CitizenDashboard() {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const { data: challengesPage, isLoading: isChallengesLoading } = useChallenges({ size: 4 });
  const { user } = useAuth();
  const recentChallenges = challengesPage?.content || [];

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Hello, {user?.displayName || 'Citizen'} 👋</h1>
          <p className="text-blue-100 max-w-xl mb-6 text-lg">
            Together we can build a better community. Report issues, track progress and be a part of real change.
          </p>
          <Link href="/challenges/new">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-full px-6">
              <PlusCircle className="mr-2 h-5 w-5" />
              Raise a Complaint
            </Button>
          </Link>
        </div>
        {/* Abstract Background Design */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
           <svg viewBox="0 0 400 400" className="absolute right-[-10%] top-[-20%] w-full h-[150%]">
              <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70.1,-57.5,79.4,-44.1C88.8,-30.7,95.7,-15.3,96.3,0.3C96.8,16,91,31.9,81.4,45.2C71.7,58.5,58.2,69.1,43.5,75.4C28.8,81.8,14.4,83.9,0.2,83.6C-14,83.2,-28,80.4,-41.2,74.1C-54.3,67.8,-66.6,57.9,-75.3,45.4C-84,32.9,-89.2,16.4,-90.2,-0.6C-91.2,-17.6,-88,-35.1,-79.1,-49.4C-70.2,-63.7,-55.6,-74.6,-40.5,-80.7C-25.3,-86.8,-12.7,-88.2,1.3,-90.4C15.2,-92.7,31.1,-83.6,44.7,-76.4Z" transform="translate(200 200) scale(1.1)" />
           </svg>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Total Complaints</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-slate-800">{metrics?.totalChallenges || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">In Progress</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
                <Activity className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-slate-800">{metrics?.pendingReview || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Resolved</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-slate-800">{metrics?.activeProjects || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">On Hold</CardTitle>
            <div className="p-2 bg-rose-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-bold text-slate-800">0</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Main Content (Left 2 columns) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Recent Complaints Table */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Recent Complaints</CardTitle>
              <Link href="/challenges" className="text-sm text-blue-600 hover:underline">View All →</Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isChallengesLoading ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">Loading your submissions…</TableCell></TableRow> : recentChallenges.length === 0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">No challenges submitted yet. Start by raising your first civic issue.</TableCell></TableRow> : recentChallenges.map((challenge) => <TableRow key={challenge.id}><TableCell className="font-medium">{challenge.title}</TableCell><TableCell><StatusBadge status={challenge.status} /></TableCell><TableCell className="text-slate-500">{formatDistanceToNow(new Date(challenge.submittedAt), { addSuffix: true })}</TableCell><TableCell className="text-right"><Link href={`/challenges/${challenge.id}`} className="text-blue-600 hover:underline text-sm">View</Link></TableCell></TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Status Tracker */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>How your challenge moves forward</CardTitle>
              <CardDescription>A transparent, human-reviewed path from submission to solution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pt-8 pb-4">
                {/* Connecting Line */}
                <div className="absolute top-10 left-12 right-12 h-1 bg-slate-100 -z-10"></div>
                <div className="absolute top-10 left-12 w-1/2 h-1 bg-blue-500 -z-10"></div>
                
                <div className="flex justify-between relative z-0">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-800">Received</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-800">Assigned</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-blue-100 shadow flex items-center justify-center mb-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-600">In Progress</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow flex items-center justify-center mb-2"></div>
                    <span className="text-xs font-medium text-slate-400">On Hold</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow flex items-center justify-center mb-2"></div>
                    <span className="text-xs font-medium text-slate-400">Resolved</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right column) */}
        <div className="space-y-6">
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/challenges/new">
                <Card className="hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/50 shadow-sm border-dashed">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600"><PlusCircle size={20} /></div>
                    <span className="text-xs font-medium">Raise Complaint</span>
                </CardContent>
                </Card>
            </Link>
            <Link href="/challenges">
                <Card className="hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/50 shadow-sm border-dashed">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-indigo-100 rounded-full text-indigo-600"><FileSearch size={20} /></div>
                    <span className="text-xs font-medium">Track Status</span>
                </CardContent>
                </Card>
            </Link>
            <Link href="/challenges">
                <Card className="hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/50 shadow-sm border-dashed">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600"><FileText size={20} /></div>
                    <span className="text-xs font-medium">My Complaints</span>
                </CardContent>
                </Card>
            </Link>
            <Link href="/support">
                <Card className="hover:border-blue-300 transition-colors cursor-pointer bg-slate-50/50 shadow-sm border-dashed">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-teal-100 rounded-full text-teal-600"><HelpCircle size={20} /></div>
                    <span className="text-xs font-medium">Need Help?</span>
                </CardContent>
                </Card>
            </Link>
          </div>

          {/* Notifications */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Bell className="w-4 h-4 mr-2 text-slate-500" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div></div>
                <div>
                  <p className="text-sm text-slate-700">Your complaint <span className="font-medium">#C1034</span> has been Assigned to the concerned department.</p>
                  <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div></div>
                <div>
                  <p className="text-sm text-slate-700">Complaint <span className="font-medium">#C1003</span> has been updated to In Progress.</p>
                  <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
                <div>
                  <p className="text-sm text-slate-700">Your complaint <span className="font-medium">#C1021</span> has been Resolved.</p>
                  <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Issues */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-slate-500" /> Nearby Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-100 rounded-lg h-32 w-full flex items-center justify-center mb-4 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
                   <MapPin className="text-blue-500 w-8 h-8 animate-bounce relative z-10" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            <span className="text-sm font-medium">Water Leakage</span>
                        </div>
                        <span className="text-xs text-slate-500">1.2 km • Open</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-sm font-medium">Street Light Issue</span>
                        </div>
                        <span className="text-xs text-slate-500">2.4 km • In Progress</span>
                    </div>
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
