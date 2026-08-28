import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DashboardMetrics } from '@/types/notification';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const data = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
      return data;
    },
  });
}
