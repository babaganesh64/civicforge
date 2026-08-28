import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { BulkJobRequest, BulkJobResponse, BulkOperationStatus } from '@/types/bulk';

export function useSubmitBulkJob() {
  return useMutation({
    mutationFn: async (data: BulkJobRequest) => {
      return apiClient.post<BulkJobResponse>('/api/v1/bulk/jobs', data);
    },
  });
}

export function usePollBulkJob(jobId: string | null) {
  return useQuery({
    queryKey: ['bulkJob', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('No job ID provided');
      return apiClient.get<BulkJobResponse>(`/api/v1/bulk/jobs/${jobId}`);
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data as BulkJobResponse | undefined;
      if (
        data &&
        (data.status === BulkOperationStatus.PENDING ||
          data.status === BulkOperationStatus.IN_PROGRESS)
      ) {
        return 2000;
      }
      return false;
    },
  });
}
