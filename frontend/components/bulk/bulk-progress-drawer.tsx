import React from 'react';
import { usePollBulkJob } from '@/hooks/useBulkOperations';
import { BulkOperationStatus } from '@/types/bulk';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface BulkProgressDrawerProps {
  jobId: string | null;
  onClose: () => void;
}

export function BulkProgressDrawer({ jobId, onClose }: BulkProgressDrawerProps) {
  const { data: job, isLoading, error } = usePollBulkJob(jobId);

  if (!jobId) return null;

  const isOpen = !!jobId;

  const isCompleted = job?.status === BulkOperationStatus.COMPLETED || job?.status === BulkOperationStatus.PARTIAL_SUCCESS || job?.status === BulkOperationStatus.FAILED;
  
  const total = job?.totalItems || 0;
  const success = job?.successCount || 0;
  const errCount = job?.errorCount || 0;
  const processed = success + errCount;
  
  const progressPercent = total > 0 ? (processed / total) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isCompleted) onClose();
      // Optionally block closing if not completed
      if (!open && !isCompleted) {
        if (confirm("Job is still running. Are you sure you want to dismiss? It will continue in background.")) {
          onClose();
        }
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Operation Progress</DialogTitle>
          <DialogDescription>
            {job?.operationType ? `Operation: ${job.operationType}` : 'Processing your request...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="text-destructive flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Failed to track job progress. It may still be running.</span>
            </div>
          )}

          {job && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span>{processed} of {total} processed</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              
              <Progress value={progressPercent} className="w-full" />
              
              <div className="flex justify-between text-sm text-muted-foreground pt-2">
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" /> {success} successful
                </span>
                {errCount > 0 && (
                  <span className="flex items-center text-destructive">
                    <AlertTriangle className="h-4 w-4 mr-1" /> {errCount} failed
                  </span>
                )}
              </div>
              
              {isCompleted && (
                <div className="pt-4 border-t mt-4 flex items-center space-x-2">
                  {errCount === 0 ? (
                    <div className="text-green-600 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">All items processed successfully!</span>
                    </div>
                  ) : job.status === BulkOperationStatus.PARTIAL_SUCCESS ? (
                    <div className="text-amber-600 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Operation completed with some errors.</span>
                    </div>
                  ) : (
                    <div className="text-destructive flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Operation failed.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} disabled={!isCompleted && !error}>
            {isCompleted || error ? 'Close' : 'Processing...'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
