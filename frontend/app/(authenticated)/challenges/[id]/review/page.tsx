'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useChallenge, useChallengeAction } from '@/hooks/useChallenges';
import { useAuth } from '@/lib/auth-hooks';
import { UserRole } from '@/types/user';
import { ChallengePriority } from '@/types/challenge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/status-badge';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, MapPin, Users, BrainCircuit } from 'lucide-react';
import { toast } from 'sonner';
import { EvidenceList } from '@/components/challenges/evidence-list';

const CATEGORIES = ['Infrastructure', 'Health', 'Education', 'Environment', 'Safety', 'Agriculture', 'Transportation', 'Other'];

export default function ChallengeReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: challenge, isLoading } = useChallenge(id);
  const actionMutation = useChallengeAction(id);
  const { user } = useAuth();

  const [rejectReason, setRejectReason] = useState('');
  const [clarification, setClarification] = useState('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const isGovernment = [UserRole.GOVERNMENT_REVIEWER, UserRole.GOVERNMENT_MANAGER].includes(user?.userType as UserRole);

  if (!isGovernment) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to access the review interface.</p>
        <Button className="mt-4" onClick={() => router.push(`/challenges/${id}`)}>Back to Challenge</Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!challenge) return <div className="p-8">Not found</div>;

  const handleAction = async (action: string, payload: any = {}) => {
    try {
      await actionMutation.mutateAsync({ action, ...payload });
      toast.success(`${action.replace(/_/g, ' ')} successful`);
      
      if (['REJECT', 'VERIFY'].includes(action)) {
        router.push('/challenges');
      }
    } catch (error) {
      toast.error(`Failed to perform ${action}`);
    }
  };

  const hasAction = (action: string) => challenge.validActions?.includes(action);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/challenges/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Review Challenge</h1>
            <p className="text-muted-foreground text-sm font-mono">{challenge.referenceNumber}</p>
          </div>
        </div>
        <StatusBadge status={challenge.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap">{challenge.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" /> Location
                  </h4>
                  <p className="text-sm">{challenge.city}, {challenge.stateProvince}</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
                    <Users className="h-4 w-4" /> Est. Impact
                  </h4>
                  <p className="text-sm">{challenge.affectedPopulationEstimate || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Evidence ({challenge.evidence?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <EvidenceList challengeId={challenge.id} evidence={challenge.evidence || []} canUpload={false} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Insights - Actionable */}
          {challenge.aiAnalysis?.status === 'COMPLETED' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" /> AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Confidence</span>
                  <span className="font-semibold">{challenge.aiAnalysis.confidenceScore}%</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Suggested Category</span>
                      <span className="font-medium text-foreground">{challenge.aiAnalysis.suggestedCategory}</span>
                    </div>
                    {hasAction('CLASSIFY') && challenge.aiAnalysis.suggestedCategory && (
                      <Button 
                        variant="secondary" size="sm" className="w-full h-7 text-xs"
                        onClick={() => handleAction('CLASSIFY', { category: challenge.aiAnalysis!.suggestedCategory })}
                        disabled={actionMutation.isPending}
                      >
                        Accept Category
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-primary/10">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Suggested Priority</span>
                      <span className="font-medium text-foreground">{challenge.aiAnalysis.suggestedPriority}</span>
                    </div>
                    {hasAction('PRIORITIZE') && challenge.aiAnalysis.suggestedPriority && (
                      <Button 
                        variant="secondary" size="sm" className="w-full h-7 text-xs"
                        onClick={() => handleAction('PRIORITIZE', { priority: challenge.aiAnalysis!.suggestedPriority })}
                        disabled={actionMutation.isPending}
                      >
                        Accept Priority
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Cards */}
          <div className="space-y-4">
            
            {hasAction('VERIFY') && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Verify Challenge</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Mark this challenge as verified and legitimate.</p>
                  <Button className="w-full" onClick={() => handleAction('VERIFY')} disabled={actionMutation.isPending}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Verify
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasAction('CLASSIFY') && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Classify</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full" variant="outline"
                    onClick={() => handleAction('CLASSIFY', { category })} 
                    disabled={!category || actionMutation.isPending}
                  >
                    Apply Category
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasAction('PRIORITIZE') && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Prioritize</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue placeholder="Select Priority" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(ChallengePriority).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full" variant="outline"
                    onClick={() => handleAction('PRIORITIZE', { priority })} 
                    disabled={!priority || actionMutation.isPending}
                  >
                    Apply Priority
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasAction('REQUEST_CLARIFICATION') && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base text-amber-600">Request Clarification</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Textarea 
                    placeholder="What information is missing?" 
                    value={clarification} onChange={(e) => setClarification(e.target.value)}
                    className="text-sm"
                  />
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
                    onClick={() => handleAction('REQUEST_CLARIFICATION', { notes: clarification })} 
                    disabled={!clarification || actionMutation.isPending}
                  >
                    Send Request
                  </Button>
                </CardContent>
              </Card>
            )}

            {hasAction('REJECT') && (
              <Card className="border-destructive/50">
                <CardHeader className="pb-2"><CardTitle className="text-base text-destructive">Reject Challenge</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Textarea 
                    placeholder="Reason for rejection (required)" 
                    value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    className="text-sm"
                  />
                  <Button 
                    className="w-full" variant="destructive"
                    onClick={() => handleAction('REJECT', { notes: rejectReason })} 
                    disabled={!rejectReason || actionMutation.isPending}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
