import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DashboardMetrics } from '@/types/notification';
import { ApiResponse } from '@/types/api';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<any>>('/api/v1/dashboards/metrics');
      const data = res.data;
      return {
        totalChallenges: data.activeChallenges || 0,
        pendingReview: data.pendingReviews || 0,
        activeProjects: data.activeProjects || 0,
        submittedEois: 0,
        myChallenges: data.activeChallenges || 0,
      } as DashboardMetrics;
    },
  });
}
