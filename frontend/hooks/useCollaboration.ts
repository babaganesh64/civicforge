import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CollaborationRequest } from '@/types/project';
import { PageResponse } from '@/types/api';

export const useCollaborationRequests = (challengeId: string) => {
  return useQuery({
    queryKey: ['collaborationRequests', challengeId],
    queryFn: async () => {
      const data = await apiClient.get<PageResponse<CollaborationRequest>>(`/api/v1/challenges/${challengeId}/collaborations`);
      return data;
    },
    enabled: !!challengeId,
  });
};

export const useSubmitCollaboration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { challengeId: string; proposalText: string }) => {
      const data = await apiClient.post<CollaborationRequest>(`/api/v1/challenges/${payload.challengeId}/collaborations`, {
        proposalText: payload.proposalText
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collaborationRequests', variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenge', variables.challengeId] });
    },
  });
};

export const useAcceptCollaboration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { challengeId: string; requestId: string }) => {
      const data = await apiClient.post<void>(`/api/v1/challenges/${payload.challengeId}/collaborations/${payload.requestId}/accept`, {});
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collaborationRequests', variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenge', variables.challengeId] });
    },
  });
};
