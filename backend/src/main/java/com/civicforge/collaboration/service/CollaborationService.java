package com.civicforge.collaboration.service;

import com.civicforge.audit.service.AuditService;
import com.civicforge.challenges.domain.ChallengeAction;
import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.domain.ChallengeStateMachine;
import com.civicforge.challenges.entity.Challenge;
import com.civicforge.challenges.entity.ChallengeHistory;
import com.civicforge.challenges.repository.ChallengeRepository;
import com.civicforge.challenges.repository.ChallengeHistoryRepository;
import com.civicforge.collaboration.dto.CollaborationRequestDto;
import com.civicforge.collaboration.entity.CollaborationRequest;
import com.civicforge.collaboration.repository.CollaborationRequestRepository;
import com.civicforge.common.audit.AuditContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollaborationService {

    private final CollaborationRequestRepository collaborationRequestRepository;
    private final ChallengeRepository challengeRepository;
    private final ChallengeHistoryRepository challengeHistoryRepository;
    private final AuditService auditService;

    @Transactional
    public CollaborationRequest submitCollaborationRequest(UUID challengeId, CollaborationRequestDto dto) {
        Challenge challenge = challengeRepository.findById(challengeId)
            .orElseThrow(() -> new RuntimeException("Challenge not found"));

        ChallengeStatus oldStatus = challenge.getStatus();
        ChallengeStatus newStatus = ChallengeStateMachine.transition(oldStatus, ChallengeAction.EXPRESS_INTEREST);
        challenge.setStatus(newStatus);
        challengeRepository.save(challenge);

        ChallengeHistory history = ChallengeHistory.builder()
            .challengeId(challengeId)
            .fromStatus(oldStatus.name())
            .toStatus(newStatus.name())
            .action(ChallengeAction.EXPRESS_INTEREST.name())
            .build();
        challengeHistoryRepository.save(history);

        CollaborationRequest req = CollaborationRequest.builder()
            .challengeId(challengeId)
            .requestingOrgId(dto.requestingOrgId())
            .type(dto.type())
            .message(dto.message())
            .status("PENDING")
            .createdBy(AuditContext.get() != null ? AuditContext.get().actorId() : UUID.randomUUID())
            .build();

        CollaborationRequest saved = collaborationRequestRepository.save(req);

        auditService.audit(
            "SUBMIT_COLLABORATION_REQUEST",
            "COLLABORATION_REQUEST",
            saved.getId().toString(),
            "SUCCESS",
            Map.of("challengeId", challengeId.toString())
        );

        return saved;
    }

    @Transactional
    public CollaborationRequest acceptCollaborationRequest(UUID requestId) {
        CollaborationRequest req = collaborationRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));
        
        req.setStatus("ACCEPTED");
        collaborationRequestRepository.save(req);

        Challenge challenge = challengeRepository.findById(req.getChallengeId())
            .orElseThrow(() -> new RuntimeException("Challenge not found"));

        ChallengeStatus oldStatus = challenge.getStatus();
        ChallengeStatus newStatus = ChallengeStateMachine.transition(oldStatus, ChallengeAction.ACCEPT);
        challenge.setStatus(newStatus);
        challengeRepository.save(challenge);

        ChallengeHistory history = ChallengeHistory.builder()
            .challengeId(challenge.getId())
            .fromStatus(oldStatus.name())
            .toStatus(newStatus.name())
            .action(ChallengeAction.ACCEPT.name())
            .build();
        challengeHistoryRepository.save(history);

        auditService.audit(
            "ACCEPT_COLLABORATION_REQUEST",
            "COLLABORATION_REQUEST",
            req.getId().toString(),
            "SUCCESS",
            Map.of("challengeId", challenge.getId().toString())
        );

        return req;
    }
    
    public List<CollaborationRequest> getRequestsForChallenge(UUID challengeId) {
        return collaborationRequestRepository.findByChallengeId(challengeId);
    }
}
