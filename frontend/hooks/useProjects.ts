import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Project, Milestone, Deliverable, ImpactMetric } from '@/types/project';
import { PageResponse } from '@/types/api';

export const useProjects = (params?: { status?: string; page?: number; size?: number }) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page !== undefined) searchParams.append('page', params.page.toString());
      if (params?.size !== undefined) searchParams.append('size', params.size.toString());

      const queryStr = searchParams.toString();
      const endpoint = queryStr ? `/api/v1/projects?${queryStr}` : '/api/v1/projects';
      
      const data = await apiClient.get<PageResponse<Project>>(endpoint);
      return data;
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const data = await apiClient.get<Project>(`/api/v1/projects/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useSubmitDeliverable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { projectId: string; milestoneId: string; deliverableId: string; fileUrl: string }) => {
      const data = await apiClient.post<Deliverable>(`/api/v1/projects/${payload.projectId}/milestones/${payload.milestoneId}/deliverables/${payload.deliverableId}/submit`, {
        fileUrl: payload.fileUrl
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};

export const useApproveDeliverable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { projectId: string; milestoneId: string; deliverableId: string; feedback?: string }) => {
      const data = await apiClient.post<Deliverable>(`/api/v1/projects/${payload.projectId}/milestones/${payload.milestoneId}/deliverables/${payload.deliverableId}/approve`, {
        feedback: payload.feedback
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};
