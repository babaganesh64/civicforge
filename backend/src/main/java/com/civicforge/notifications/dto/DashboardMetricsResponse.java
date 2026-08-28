package com.civicforge.notifications.dto;

public record DashboardMetricsResponse(
    long activeChallenges,
    long pendingReviews,
    long activeProjects,
    long totalOrganizations
) {}
