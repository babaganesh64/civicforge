'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useChallenge } from '@/hooks/useChallenges';
import { useAuth } from '@/lib/auth-hooks';
import { UserRole } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/status-badge';
import { format } from 'date-fns';
import { 
  ArrowLeft, BrainCircuit, CheckCircle2, AlertTriangle, Send, ShieldCheck,
  MapPin, Clock, Users, FileText, Settings, Info
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ChallengeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: challenge, isLoading, error } = useChallenge(id);
  const { user } = useAuth();
  
  const isGovernment = [UserRole.GOVERNMENT_REVIEWER, UserRole.GOVERNMENT_MANAGER].includes(user?.userType as UserRole);

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-12 w-1/3 mb-4"/><Skeleton className="h-64 w-full"/></div>;
  }

  if (error || !challenge) {
    return <div className="p-8 text-red-500">Failed to load challenge.</div>;
  }

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/challenges" className="hover:text-blue-600 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Challenges
            </Link>
            <span>•</span>
            <span className="font-mono">{challenge.referenceNumber}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{challenge.title}</h1>
          <div className="flex items-center gap-3 mt-3">
            <StatusBadge status={challenge.status} />
            <Badge variant="outline" className="bg-slate-50">{challenge.category}</Badge>
            <span className="text-sm text-slate-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {format(new Date(challenge.submittedAt), 'PPp')}
            </span>
          </div>
        </div>
        
        {isGovernment && (
          <div className="flex gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700"><Link href={`/challenges/${challenge.id}/review`}><ShieldCheck className="mr-2 h-4 w-4" /> Open review workflow</Link></Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Analysis - HIGHLIGHTED FOR GOVERNMENT */}
          {isGovernment && (
            <Card className="border-2 border-indigo-100 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <BrainCircuit className="w-32 h-32 text-indigo-500" />
              </div>
              <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4 relative z-10">
                <CardTitle className="text-indigo-800 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" /> 
                  Automated AI Analysis
                  <Badge className="ml-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200 text-xs font-semibold">Recommendations</Badge>
                </CardTitle>
                <CardDescription className="text-indigo-600/80">Our AI has processed this submission and generated the following insights. These are recommendations and require human verification.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Suggested Category</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                       {challenge.category} <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Suggested Priority</p>
                    <p className="font-medium text-red-600 flex items-center gap-2">
                       HIGH <AlertTriangle className="w-4 h-4 text-red-500" />
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Responsible Dept.</p>
                    <p className="font-medium text-slate-900">Department of Public Works</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Duplicate Detection</p>
                    <p className="font-medium text-green-600">No duplicates found in 5km radius</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">AI Summary</p>
                  <p className="text-sm text-slate-700 bg-indigo-50/30 p-3 rounded-lg border border-indigo-50">
                    Citizen is reporting a severe structural issue that poses an immediate safety hazard. The description indicates that multiple people are affected and local traffic is disrupted. Immediate assessment is recommended.
                  </p>
                </div>

                <div className="mt-6 flex gap-2">
                   <Button variant="outline" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"><ShieldCheck className="w-4 h-4 mr-2" /> Approve AI Recommendations</Button>
                   <Button variant="ghost" size="sm" className="text-slate-500"><Settings className="w-4 h-4 mr-2" /> Override manually</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Original Details */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{challenge.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p>{challenge.locationDescription}</p>
                      <p className="text-sm text-slate-500">{challenge.city}, {challenge.stateProvince} {challenge.pincode}</p>
                      {challenge.latitude && <p className="text-xs text-slate-400 mt-1">Lat: {challenge.latitude}, Lng: {challenge.longitude}</p>}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Impact</h3>
                  <div className="flex items-start gap-2 text-slate-700">
                    <Users className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p>{challenge.affectedPopulationEstimate} people affected</p>
                      <p className="text-sm text-slate-500">{challenge.affectedPopulationNotes}</p>
                    </div>
                  </div>
                </div>
              </div>

              {challenge.expectedOutcome && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Expected Outcome</h3>
                    <p className="text-slate-700">{challenge.expectedOutcome}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Evidence & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {challenge.evidence && challenge.evidence.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {challenge.evidence.map((file, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                      <FileText className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-600 text-center truncate w-full">{file.fileName.split('/').pop()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-slate-500">No evidence files attached.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-base">Quick Operations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-sm text-slate-600">Verify, classify, prioritize, route, and publish this challenge through the controlled review flow.</p>
              <Button asChild className="w-full justify-start bg-slate-900"><Link href={`/challenges/${challenge.id}/review`}><Send className="mr-2 h-4 w-4" /> Continue review</Link></Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Submitter Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">User ID</span>
                <span className="font-mono text-xs">{challenge.submittedBy}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Date</span>
                <span>{format(new Date(challenge.submittedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consent Given</span>
                <span className="text-green-600 font-medium">Yes</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm bg-blue-50 border-blue-100">
             <CardContent className="p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                   <p className="font-semibold mb-1">Status Flow Guideline</p>
                   <p className="text-blue-600/80">Submitted → Under Review → Verified → Assigned → In Progress → Resolved</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
