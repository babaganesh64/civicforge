package com.civicforge.notifications.controller;

import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.repository.ChallengeRepository;
import com.civicforge.common.dto.ApiResponse;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.identity.security.UserRole;
import com.civicforge.notifications.dto.DashboardMetricsResponse;
import com.civicforge.organizations.repository.OrganizationRepository;
import com.civicforge.projects.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboards")
@RequiredArgsConstructor
public class DashboardController {

    private final ChallengeRepository challengeRepository;
    private final OrganizationRepository organizationRepository;
    private final ProjectRepository projectRepository;

    @GetMapping("/metrics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DashboardMetricsResponse>> getMetrics(
            @AuthenticationPrincipal CivicForgeUserDetails principal) {
        
        long activeChallenges = 0;
        long pendingReviews = 0;
        long activeProjects = 0;
        long totalOrganizations = 0;
        
        if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_GOVERNMENT_MANAGER"))) {
            activeChallenges = challengeRepository.countByStatus(ChallengeStatus.PUBLISHED);
            pendingReviews = challengeRepository.countByStatus(ChallengeStatus.UNDER_REVIEW);
            activeProjects = projectRepository.countByStatus("ACTIVE");
            totalOrganizations = organizationRepository.count();
        } else if (principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SYSTEM_ADMIN"))) {
            activeChallenges = challengeRepository.countByStatus(ChallengeStatus.PUBLISHED);
            pendingReviews = challengeRepository.countByStatus(ChallengeStatus.UNDER_REVIEW);
            activeProjects = projectRepository.countByStatus("ACTIVE");
            totalOrganizations = organizationRepository.count();
        } else {
            // For CITIZEN or ORG_ADMIN, we can just return basic stats or user-specific stats
            activeChallenges = challengeRepository.countByStatus(ChallengeStatus.PUBLISHED);
            activeProjects = projectRepository.countByStatus("ACTIVE");
        }
        
        DashboardMetricsResponse response = new DashboardMetricsResponse(
                activeChallenges,
                pendingReviews,
                activeProjects,
                totalOrganizations
        );
        
        return ResponseEntity.ok(ApiResponse.success(response, "Dashboard metrics retrieved"));
    }
}
