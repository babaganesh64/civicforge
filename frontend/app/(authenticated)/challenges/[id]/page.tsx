'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useChallenge } from '@/hooks/useChallenges';
import { useAuth } from '@/lib/auth-hooks';
import { UserRole } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/common/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin, Users, AlertCircle, FileText, Activity, Map, Calendar, User, Info, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EvidenceList } from '@/components/challenges/evidence-list';
import { ChallengeTimeline } from '@/components/challenges/challenge-timeline';
import { AiAnalysisCard } from '@/components/challenges/ai-analysis-card';
import { SubmitEoiDialog } from '@/components/challenges/submit-eoi-dialog';
import { EoiList } from '@/components/challenges/eoi-list';

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: challenge, isLoading, error } = useChallenge(id);
  const { user } = useAuth();

  const isGovernment = [UserRole.GOVERNMENT_REVIEWER, UserRole.GOVERNMENT_MANAGER].includes(user?.userType as UserRole);
  const isUniversityOrIndustry = [
    UserRole.UNIVERSITY_ADMIN, UserRole.UNIVERSITY_MEMBER, UserRole.UNIVERSITY_PROJECT_MANAGER,
    UserRole.INDUSTRY_ADMIN, UserRole.INDUSTRY_MEMBER
  ].includes(user?.userType as UserRole);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="p-8">
        <div className="p-4 border border-destructive bg-destructive/10 text-destructive rounded">
          Error loading challenge details.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/challenges" className="hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Challenges
          </Link>
          <span>/</span>
          <span className="font-mono">{challenge.referenceNumber}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{challenge.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={challenge.status} />
              {challenge.priority && (
                <Badge variant={challenge.priority === 'CRITICAL' ? 'destructive' : challenge.priority === 'HIGH' ? 'default' : 'secondary'}>
                  {challenge.priority} Priority
                </Badge>
              )}
              <Badge variant="outline" className="font-mono bg-muted/50">{challenge.referenceNumber}</Badge>
              <Badge variant="outline">{challenge.category}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isGovernment && challenge.validActions?.length > 0 && (
              <Button asChild>
                <Link href={`/challenges/${challenge.id}/review`}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Start Review
                </Link>
              </Button>
            )}
            {isUniversityOrIndustry && challenge.status === 'PUBLISHED' && (
              <SubmitEoiDialog challengeId={challenge.id} />
            )}
          </div>
        </div>
      </div>

      {challenge.rejectionReason && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded text-destructive flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Challenge Rejected</h4>
            <p className="text-sm mt-1">{challenge.rejectionReason}</p>
          </div>
        </div>
      )}

      {challenge.clarificationRequest && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-amber-900 flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Clarification Requested</h4>
            <p className="text-sm mt-1">{challenge.clarificationRequest}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="evidence">Evidence ({challenge.evidence?.length || 0})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              {isGovernment && <TabsTrigger value="ai">AI Analysis</TabsTrigger>}
              {isGovernment && challenge.status === 'PUBLISHED' && <TabsTrigger value="eoi">Expressions of Interest</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" /> Problem Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{challenge.description}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" /> Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">City, State</p>
                      <p>{challenge.city}, {challenge.stateProvince} {challenge.pincode}</p>
                    </div>
                    {challenge.locationDescription && (
                      <div>
                        <p className="font-medium text-muted-foreground">Specific Details</p>
                        <p>{challenge.locationDescription}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" /> Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {challenge.affectedPopulationEstimate !== null && (
                      <div>
                        <p className="font-medium text-muted-foreground">Estimated Population Affected</p>
                        <p>{challenge.affectedPopulationEstimate.toLocaleString()} people</p>
                      </div>
                    )}
                    {challenge.affectedPopulationNotes && (
                      <div>
                        <p className="font-medium text-muted-foreground">Impact Notes</p>
                        <p>{challenge.affectedPopulationNotes}</p>
                      </div>
                    )}
                    {challenge.urgency && (
                      <div>
                        <p className="font-medium text-muted-foreground">Urgency Level</p>
                        <p>{challenge.urgency}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {challenge.expectedOutcome && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-muted-foreground" /> Expected Outcome
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{challenge.expectedOutcome}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="evidence" className="mt-6">
              <EvidenceList 
                challengeId={challenge.id} 
                evidence={challenge.evidence || []} 
                canUpload={!['REJECTED', 'CLOSED', 'ARCHIVED'].includes(challenge.status)}
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ChallengeTimeline history={challenge.history || []} />
                </CardContent>
              </Card>
            </TabsContent>

            {isGovernment && (
              <TabsContent value="ai" className="mt-6">
                <AiAnalysisCard analysis={challenge.aiAnalysis} />
              </TabsContent>
            )}

            {isGovernment && challenge.status === 'PUBLISHED' && (
              <TabsContent value="eoi" className="mt-6">
                <EoiList challengeId={challenge.id} />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">Submitted By</p>
                  <p className="font-medium truncate" title={challenge.submittedBy}>{challenge.submittedBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Submitted At</p>
                  <p className="font-medium">{format(new Date(challenge.submittedAt), 'PPp')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{format(new Date(challenge.updatedAt), 'PPp')}</p>
                </div>
              </div>
              {challenge.verifiedAt && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Verified At</p>
                    <p className="font-medium">{format(new Date(challenge.verifiedAt), 'PPp')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
