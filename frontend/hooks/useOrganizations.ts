import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Organization } from '@/types/organization';
import { PageResponse } from '@/types/api';

export function useMyOrganizations() {
  return useQuery({
    queryKey: ['organizations', 'my'],
    queryFn: () => apiClient.get<Organization[]>('/api/v1/organizations/my'),
  });
}

export function useOrganizations(orgType?: string, page: number = 0) {
  return useQuery({
    queryKey: ['organizations', { orgType, page }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (orgType) params.append('type', orgType);
      params.append('page', page.toString());
      return apiClient.get<PageResponse<Organization>>(`/api/v1/organizations?${params.toString()}`);
    },
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => apiClient.get<Organization>(`/api/v1/organizations/${id}`),
    enabled: !!id,
  });
}
