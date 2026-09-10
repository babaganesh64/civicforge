'use client';

import { useAuth } from '@/lib/auth-hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, Sparkles } from 'lucide-react';
import { CitizenDashboard } from '@/components/dashboard/CitizenDashboard';
import { GovernmentDashboard } from '@/components/dashboard/GovernmentDashboard';
import { useChallenges } from '@/hooks/useChallenges';
import { StatusBadge } from '@/components/common/status-badge';

function OrganizationDashboard() {
  const { data: assignedChallenges, isLoading } = useChallenges({ size: 6 });
  const challenges = assignedChallenges?.content || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700"><Sparkles className="h-4 w-4" /> Partner workspace</div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Turn civic challenges into measurable impact.</h2>
            <p className="mt-2 text-slate-600">Your team can review government-routed opportunities and collaborate on public challenges that match your expertise.</p>
          </div>
          <Button asChild className="bg-slate-900 hover:bg-slate-800"><Link href="/marketplace">Explore marketplace <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Assigned to your team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : challenges.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Public opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Marketplace</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Next step</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Review a routed brief or discover a public challenge.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div><CardTitle className="flex items-center gap-2"><BriefcaseBusiness className="h-5 w-5 text-emerald-600" /> Your challenge desk</CardTitle><p className="mt-1 text-sm text-muted-foreground">Government-routed work and public opportunities visible to your organization.</p></div>
          <Button variant="outline" size="sm" asChild><Link href="/challenges">View all <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading your challenge desk…</p> : challenges.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center"><Building2 className="mx-auto mb-3 h-8 w-8 text-slate-400" /><p className="font-medium">No routed challenges yet</p><p className="mt-1 text-sm text-muted-foreground">Use the marketplace to discover published opportunities while you wait.</p><Button className="mt-4" variant="outline" asChild><Link href="/marketplace">Browse marketplace</Link></Button></div>
          ) : <div className="grid gap-3 md:grid-cols-2">{challenges.map((challenge) => <Link href={`/challenges/${challenge.id}`} key={challenge.id} className="rounded-xl border p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"><div className="flex items-start justify-between gap-3"><p className="font-semibold">{challenge.title}</p><StatusBadge status={challenge.status} /></div><div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {challenge.city || 'Location pending'}, {challenge.stateProvince || 'Jharkhand'}</div><p className="mt-2 text-xs font-medium text-emerald-700">{challenge.isPublic ? 'Public opportunity' : 'Direct government assignment'}</p></Link>)}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const userRole = (user as any).role || user.userType || '';
  const isGovernment = userRole.includes('GOVERNMENT') || userRole.includes('ADMIN');
  const isUniversity = userRole.includes('UNIVERSITY');
  const isIndustry = userRole.includes('INDUSTRY');
  
  if (isGovernment) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Government Portal Dashboard</h1>
          <p className="text-slate-500 text-lg">Operational overview, verification metrics, and system analytics.</p>
        </div>
        <GovernmentDashboard />
      </div>
    );
  } else if (isUniversity || isIndustry) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Welcome back, {user.displayName}!</h1>
          <p className="text-slate-500 text-lg">Here&apos;s an overview of your account activity.</p>
        </div>
        <OrganizationDashboard />
      </div>
    );
  }

  // Citizen Dashboard has its own hero header now!
  return <CitizenDashboard />;
}
