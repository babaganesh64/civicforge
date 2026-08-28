package com.civicforge.projects.service;

import com.civicforge.audit.service.AuditService;
import com.civicforge.challenges.domain.ChallengeAction;
import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.domain.ChallengeStateMachine;
import com.civicforge.challenges.entity.Challenge;
import com.civicforge.challenges.entity.ChallengeHistory;
import com.civicforge.challenges.repository.ChallengeRepository;
import com.civicforge.challenges.repository.ChallengeHistoryRepository;
import com.civicforge.projects.dto.*;
import com.civicforge.projects.entity.*;
import com.civicforge.projects.repository.*;
import com.civicforge.common.audit.AuditContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final MilestoneRepository milestoneRepository;
    private final DeliverableRepository deliverableRepository;
    private final ImpactMetricRepository impactMetricRepository;
    private final ChallengeRepository challengeRepository;
    private final ChallengeHistoryRepository challengeHistoryRepository;
    private final AuditService auditService;

    @Transactional
    public Project createProject(ProjectDto dto) {
        Challenge challenge = challengeRepository.findById(dto.challengeId())
            .orElseThrow(() -> new RuntimeException("Challenge not found"));

        ChallengeStatus oldStatus = challenge.getStatus();
        ChallengeStatus newStatus = ChallengeStateMachine.transition(oldStatus, ChallengeAction.FORM_PROJECT);
        challenge.setStatus(newStatus);
        challengeRepository.save(challenge);

        ChallengeHistory history = ChallengeHistory.builder()
            .challengeId(challenge.getId())
            .fromStatus(oldStatus.name())
            .toStatus(newStatus.name())
            .action(ChallengeAction.FORM_PROJECT.name())
            .build();
        challengeHistoryRepository.save(history);

        Project project = Project.builder()
            .challengeId(dto.challengeId())
            .leadOrganizationId(dto.leadOrganizationId())
            .title(dto.title())
            .description(dto.description())
            .startDate(dto.startDate())
            .expectedEndDate(dto.expectedEndDate())
            .status("DRAFT")
            .health("ON_TRACK")
            .createdBy(AuditContext.get() != null && AuditContext.get().actorId() != null ? AuditContext.get().actorId() : UUID.randomUUID())
            .build();

        Project saved = projectRepository.save(project);

        auditService.audit("CREATE_PROJECT", "PROJECT", saved.getId().toString(), "SUCCESS", Map.of("challengeId", challenge.getId().toString()));

        return saved;
    }

    public Project getProject(UUID projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Transactional
    public ProjectMember addProjectMember(UUID projectId, UUID userId, String role) {
        ProjectMember member = ProjectMember.builder()
            .projectId(projectId)
            .userId(userId)
            .role(role)
            .build();
        ProjectMember saved = projectMemberRepository.save(member);
        auditService.audit("ADD_PROJECT_MEMBER", "PROJECT", projectId.toString(), "SUCCESS", Map.of("userId", userId.toString(), "role", role));
        return saved;
    }

    @Transactional
    public Milestone createMilestone(MilestoneDto dto) {
        Milestone milestone = Milestone.builder()
            .projectId(dto.projectId())
            .title(dto.title())
            .description(dto.description())
            .ownerId(dto.ownerId())
            .dueDate(dto.dueDate())
            .status("PENDING")
            .build();
        Milestone saved = milestoneRepository.save(milestone);
        auditService.audit("CREATE_MILESTONE", "PROJECT", dto.projectId().toString(), "SUCCESS", Map.of("milestoneId", saved.getId().toString()));
        return saved;
    }

    @Transactional
    public Deliverable submitDeliverable(DeliverableDto dto) {
        Deliverable deliverable = Deliverable.builder()
            .projectId(dto.projectId())
            .milestoneId(dto.milestoneId())
            .title(dto.title())
            .description(dto.description())
            .fileId(dto.fileId())
            .submittedBy(AuditContext.get() != null && AuditContext.get().actorId() != null ? AuditContext.get().actorId() : UUID.randomUUID())
            .status("SUBMITTED")
            .build();
        Deliverable saved = deliverableRepository.save(deliverable);
        auditService.audit("SUBMIT_DELIVERABLE", "PROJECT", dto.projectId().toString(), "SUCCESS", Map.of("deliverableId", saved.getId().toString()));
        return saved;
    }

    @Transactional
    public Deliverable approveDeliverable(UUID deliverableId) {
        Deliverable deliverable = deliverableRepository.findById(deliverableId)
            .orElseThrow(() -> new RuntimeException("Not found"));
        deliverable.setStatus("APPROVED");
        Deliverable saved = deliverableRepository.save(deliverable);
        auditService.audit("APPROVE_DELIVERABLE", "DELIVERABLE", deliverableId.toString(), "SUCCESS", null);
        return saved;
    }

    @Transactional
    public ImpactMetric recordImpactMetric(ImpactMetricDto dto) {
        ImpactMetric metric = ImpactMetric.builder()
            .projectId(dto.projectId())
            .metricName(dto.metricName())
            .metricValue(dto.metricValue())
            .metricUnit(dto.metricUnit())
            .description(dto.description())
            .recordedBy(AuditContext.get() != null && AuditContext.get().actorId() != null ? AuditContext.get().actorId() : UUID.randomUUID())
            .build();
        ImpactMetric saved = impactMetricRepository.save(metric);
        auditService.audit("RECORD_IMPACT_METRIC", "PROJECT", dto.projectId().toString(), "SUCCESS", Map.of("metricName", dto.metricName()));
        return saved;
    }
}
