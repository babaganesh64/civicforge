import { useCollaborationRequests, useAcceptCollaboration } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export function EoiList({ challengeId }: { challengeId: string }) {
  const { data, isLoading, error } = useCollaborationRequests(challengeId);
  const acceptMutation = useAcceptCollaboration();

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading expressions of interest.</div>;
  }

  const requests = data?.content || [];

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No expressions of interest received yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <Card key={request.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{request.organizationName}</CardTitle>
                <p className="text-sm text-muted-foreground">Contact: {request.contactPerson} | Submitted: {format(new Date(request.submittedAt), 'PPp')}</p>
              </div>
              <Badge variant={request.status === 'ACCEPTED' ? 'default' : 'secondary'}>{request.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap mb-4">
              {request.proposalText}
            </div>
            {request.status === 'PENDING' && (
              <Button 
                onClick={() => acceptMutation.mutate({ challengeId, requestId: request.id })}
                disabled={acceptMutation.isPending}
              >
                Accept Proposal
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
