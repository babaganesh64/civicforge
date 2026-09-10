import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Organization } from '@/types/organization';
import { PageResponse, ApiResponse } from '@/types/api';

export function useMyOrganizations() {
  return useQuery({
    queryKey: ['organizations', 'my'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Organization[]>>('/api/v1/organizations/my');
      return res.data;
    }
  });
}

export function useOrganizations(orgType?: string, page: number = 0, refetchInterval?: number) {
  return useQuery({
    queryKey: ['organizations', { orgType, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (orgType) params.append('orgType', orgType);
      params.append('page', page.toString());
      return apiClient.get<PageResponse<Organization>>(`/api/v1/organizations?${params.toString()}`);
    },
    refetchInterval
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Organization>>(`/api/v1/organizations/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
