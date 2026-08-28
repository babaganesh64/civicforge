import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { PageResponse, ApiResponse } from '@/types/api';
import {
  ChallengeListItem,
  ChallengeDetailResponse,
  ChallengeStatus,
  ChallengePriority,
  SubmitChallengeRequest
} from '@/types/challenge';

interface ChallengeParams {
  status?: ChallengeStatus | '';
  category?: string;
  priority?: ChallengePriority | '';
  search?: string;
  page?: number;
  size?: number;
}

export function useChallenges(params: ChallengeParams) {
  return useQuery({
    queryKey: ['challenges', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.append('status', params.status);
      if (params.category) searchParams.append('category', params.category);
      if (params.priority) searchParams.append('priority', params.priority);
      if (params.search) searchParams.append('search', params.search);
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());

      const queryStr = searchParams.toString();
      const endpoint = queryStr ? `/api/v1/challenges?${queryStr}` : '/api/v1/challenges';
      return apiClient.get<PageResponse<ChallengeListItem>>(endpoint);
    }
  });
}

export function useChallenge(id: string) {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ChallengeDetailResponse>>(`/api/v1/challenges/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSubmitChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitChallengeRequest) => {
      const response = await apiClient.post<ApiResponse<ChallengeDetailResponse>>('/api/v1/challenges', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export interface ActionPayload {
  action: string;
  notes?: string;
  category?: string;
  priority?: string;
  assignToOrganizationId?: string;
}

export function useChallengeAction(challengeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ActionPayload) => {
      const response = await apiClient.post<ApiResponse<ChallengeDetailResponse>>(`/api/v1/challenges/${challengeId}/actions`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useUploadEvidence(challengeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, description }: { file: File, description?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (description) formData.append('description', description);

      // Using fetch directly because we need multipart/form-data support
      const token = typeof window !== 'undefined' ? localStorage.getItem('cf_access_token') : null;
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${baseUrl}/api/v1/challenges/${challengeId}/evidence`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to upload file';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const responseData = await response.json();
      return responseData.data as ChallengeDetailResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] });
    },
  });
}
