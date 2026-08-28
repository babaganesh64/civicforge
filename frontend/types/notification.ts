export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  targetUrl?: string;
  readAt?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalChallenges?: number;
  pendingReview?: number;
  activeProjects?: number;
  submittedEois?: number;
  myChallenges?: number;
}
