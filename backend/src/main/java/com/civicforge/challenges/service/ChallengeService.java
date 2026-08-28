package com.civicforge.challenges.service;

import com.civicforge.audit.service.AuditService;
import com.civicforge.challenges.domain.ChallengeAction;
import com.civicforge.challenges.domain.ChallengeStateMachine;
import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.dto.ChallengeDetailResponse;
import com.civicforge.challenges.dto.ChallengeFilterParams;
import com.civicforge.challenges.dto.ChallengeListItem;
import com.civicforge.challenges.dto.ReviewActionRequest;
import com.civicforge.challenges.dto.SubmitChallengeRequest;
import com.civicforge.challenges.entity.Challenge;
import com.civicforge.challenges.entity.ChallengeAiAnalysis;
import com.civicforge.challenges.entity.ChallengeEvidence;
import com.civicforge.challenges.entity.ChallengeHistory;
import com.civicforge.challenges.repository.ChallengeAiAnalysisRepository;
import com.civicforge.challenges.repository.ChallengeEvidenceRepository;
import com.civicforge.challenges.repository.ChallengeHistoryRepository;
import com.civicforge.challenges.repository.ChallengeRepository;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.files.entity.FileMetadata;
import com.civicforge.files.repository.FileMetadataRepository;
import com.civicforge.files.service.FileStorageService;
import com.civicforge.identity.security.UserRole;
import com.civicforge.users.repository.UserRepository;
import com.civicforge.ai.service.AiIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.context.ApplicationEventPublisher;
import com.civicforge.common.events.ChallengeStatusChangedEvent;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeHistoryRepository historyRepository;
    private final ChallengeEvidenceRepository evidenceRepository;
    private final ChallengeAiAnalysisRepository aiAnalysisRepository;
    private final FileStorageService fileStorageService;
    private final FileMetadataRepository fileMetadataRepository;
    private final AuditService auditService;
    private final UserRepository userRepository;
    private final AiIntegrationService aiIntegrationService;
    private final ApplicationEventPublisher eventPublisher;

    public ChallengeDetailResponse submitChallenge(SubmitChallengeRequest req, UUID actorId) {
        if (!Boolean.TRUE.equals(req.consentGiven())) {
            throw new CivicForgeException(ErrorCode.VALIDATION_ERROR, "Consent must be given", HttpStatus.BAD_REQUEST);
        }

        Challenge challenge = Challenge.builder()
            .title(req.title())
            .description(req.description())
            .category(req.category())
            .subCategory(req.subCategory())
            .locationDescription(req.locationDescription())
            .stateProvince(req.stateProvince())
            .city(req.city())
            .pincode(req.pincode())
            .latitude(req.latitude())
            .longitude(req.longitude())
            .affectedPopulationEstimate(req.affectedPopulationEstimate())
            .affectedPopulationNotes(req.affectedPopulationNotes())
            .urgency(req.urgency())
            .expectedOutcome(req.expectedOutcome())
            .consentGiven(req.consentGiven())
            .status(ChallengeStatus.SUBMITTED)
            .submittedBy(actorId)
            .submittedAt(Instant.now())
            .isPublic(false)
            .build();

        challenge = challengeRepository.save(challenge);

        recordHistory(challenge.getId(), ChallengeStatus.DRAFT, ChallengeStatus.SUBMITTED, ChallengeAction.SUBMIT, actorId, null, null);

        auditService.audit("CHALLENGE_SUBMIT", "CHALLENGE", challenge.getId().toString(), "SUCCESS", java.util.Map.of("actorId", actorId.toString(), "notes", "Challenge submitted successfully"));

        aiIntegrationService.triggerAiAnalysis(challenge.getId());

        return buildDetailResponse(challenge);
    }

    public ChallengeDetailResponse attachEvidence(UUID challengeId, MultipartFile file, String description, UUID actorId) {
        Challenge challenge = challengeRepository.findById(challengeId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.CHALLENGE_NOT_FOUND, "Challenge not found", HttpStatus.NOT_FOUND));

        if (!challenge.getSubmittedBy().equals(actorId)) {
            throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Only submitter can attach evidence", HttpStatus.FORBIDDEN);
        }

        FileMetadata metadata = fileStorageService.storeFile(file, actorId, "evidence");

        ChallengeEvidence evidence = ChallengeEvidence.builder()
            .challengeId(challengeId)
            .fileId(metadata.getId())
            .fileName(metadata.getOriginalFilename())
            .description(description)
            .uploadedBy(actorId)
            .build();
        evidenceRepository.save(evidence);

        auditService.audit("CHALLENGE_ATTACH_EVIDENCE", "CHALLENGE", challengeId.toString(), "SUCCESS", java.util.Map.of("actorId", actorId.toString(), "notes", "Evidence attached"));

        return buildDetailResponse(challenge);
    }

    @Transactional(readOnly = true)
    public Page<ChallengeListItem> listChallenges(ChallengeFilterParams filters, Pageable pageable, UUID actorId, String actorRole) {
        if (UserRole.CITIZEN.name().equals(actorRole)) {
            return challengeRepository.findBySubmittedByOrderByUpdatedAtDesc(actorId, pageable)
                .map(ChallengeListItem::from);
        }
        return challengeRepository.findWithFilters(filters.status(), filters.category(), filters.priority(), filters.submittedBy(), filters.search(), pageable)
            .map(ChallengeListItem::from);
    }

    @Transactional(readOnly = true)
    public ChallengeDetailResponse getChallenge(UUID id, UUID actorId, String actorRole) {
        Challenge challenge = challengeRepository.findById(id)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.CHALLENGE_NOT_FOUND, "Challenge not found", HttpStatus.NOT_FOUND));

        if (UserRole.CITIZEN.name().equals(actorRole)) {
            if (!challenge.getSubmittedBy().equals(actorId) && !challenge.isPublic()) {
                throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
            }
        }
        return buildDetailResponse(challenge);
    }

    public ChallengeDetailResponse performAction(UUID challengeId, ReviewActionRequest req, UUID actorId, String actorEmail, String actorRole) {
        Challenge challenge = challengeRepository.findById(challengeId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.CHALLENGE_NOT_FOUND, "Challenge not found", HttpStatus.NOT_FOUND));

        authorizeAction(req.action(), challenge, actorId, actorRole);

        ChallengeStatus currentStatus = challenge.getStatus();
        ChallengeStatus newStatus = ChallengeStateMachine.transition(currentStatus, req.action());

        challenge.setStatus(newStatus);
        
        if (req.action() == ChallengeAction.VERIFY) {
            challenge.setVerifiedBy(actorId);
            challenge.setVerifiedAt(Instant.now());
        } else if (req.action() == ChallengeAction.REJECT) {
            challenge.setRejectionReason(req.notes());
        } else if (req.action() == ChallengeAction.REQUEST_CLARIFICATION) {
            challenge.setClarificationRequest(req.notes());
        } else if (req.action() == ChallengeAction.CLASSIFY && req.category() != null) {
            challenge.setCategory(req.category());
        } else if (req.action() == ChallengeAction.PRIORITIZE && req.priority() != null) {
            challenge.setPriority(req.priority());
        } else if (req.action() == ChallengeAction.PUBLISH) {
            challenge.setPublic(true);
        }

        challengeRepository.save(challenge);
        recordHistory(challenge.getId(), currentStatus, newStatus, req.action(), actorId, actorEmail, req.notes());
        auditService.audit("CHALLENGE_ACTION", "CHALLENGE", challenge.getId().toString(), "SUCCESS", java.util.Map.of("actorId", actorId.toString(), "notes", "Action: " + req.action()));

        if (currentStatus != newStatus) {
            eventPublisher.publishEvent(new ChallengeStatusChangedEvent(this, challenge.getId(), currentStatus, newStatus, actorId, challenge.getSubmittedBy()));
        }

        return buildDetailResponse(challenge);
    }

    private void authorizeAction(ChallengeAction action, Challenge challenge, UUID actorId, String actorRole) {
        switch (action) {
            case SUBMIT:
                if (!challenge.getSubmittedBy().equals(actorId)) throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
                break;
            case START_REVIEW:
            case VERIFY:
            case REJECT:
            case REQUEST_CLARIFICATION:
            case CLASSIFY:
            case PRIORITIZE:
            case ROUTE:
            case PUBLISH:
                if (!UserRole.GOVERNMENT_REVIEWER.name().equals(actorRole) && !UserRole.GOVERNMENT_MANAGER.name().equals(actorRole)) {
                    throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
                }
                break;
            case RESUBMIT:
                if (!challenge.getSubmittedBy().equals(actorId)) throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
                break;
            case EXPRESS_INTEREST:
            case ACCEPT:
                if (!UserRole.UNIVERSITY_ADMIN.name().equals(actorRole) && !UserRole.INDUSTRY_ADMIN.name().equals(actorRole)) {
                    throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
                }
                break;
            case FORM_PROJECT:
            case START_PROGRESS:
            case BEGIN_PILOT:
            case DEPLOY:
            case MEASURE_IMPACT:
                if (!UserRole.UNIVERSITY_ADMIN.name().equals(actorRole) && !UserRole.GOVERNMENT_MANAGER.name().equals(actorRole)) {
                    throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
                }
                break;
            case CLOSE:
            case ARCHIVE:
                if (!UserRole.GOVERNMENT_MANAGER.name().equals(actorRole) && !UserRole.PLATFORM_ADMIN.name().equals(actorRole)) {
                    throw new CivicForgeException(ErrorCode.CHALLENGE_ACCESS_DENIED, "Access denied", HttpStatus.FORBIDDEN);
                }
                break;
        }
    }

    private void recordHistory(UUID challengeId, ChallengeStatus from, ChallengeStatus to, ChallengeAction action, UUID actorId, String actorEmail, String notes) {
        ChallengeHistory history = ChallengeHistory.builder()
            .challengeId(challengeId)
            .fromStatus(from != null ? from.name() : null)
            .toStatus(to.name())
            .action(action.name())
            .actorId(actorId)
            .actorEmail(actorEmail)
            .notes(notes)
            .build();
        historyRepository.save(history);
    }

    private ChallengeDetailResponse buildDetailResponse(Challenge c) {
        List<ChallengeDetailResponse.EvidenceItem> evidence = evidenceRepository.findByChallengeIdOrderByUploadedAtAsc(c.getId()).stream()
            .map(e -> new ChallengeDetailResponse.EvidenceItem(e.getId(), e.getFileId(), e.getFileName(), e.getDescription(), e.getUploadedAt()))
            .toList();

        List<ChallengeDetailResponse.HistoryItem> history = historyRepository.findByChallengeIdOrderByCreatedAtAsc(c.getId()).stream()
            .map(h -> new ChallengeDetailResponse.HistoryItem(h.getId(), h.getFromStatus(), h.getToStatus(), h.getAction(), h.getActorEmail(), h.getNotes(), h.getCreatedAt()))
            .toList();

        ChallengeDetailResponse.AiAnalysisSummary aiAnalysis = aiAnalysisRepository.findByChallengeId(c.getId())
            .map(a -> new ChallengeDetailResponse.AiAnalysisSummary(a.getStatus(), a.getSuggestedCategory(), a.getSuggestedPriority(), a.getSummary(), a.getExplanation(), a.getConfidenceScore(), a.isHumanOverride()))
            .orElse(null);

        List<String> validActions = ChallengeStateMachine.validActions(c.getStatus()).stream()
            .map(Enum::name)
            .toList();

        return new ChallengeDetailResponse(
            c.getId(), c.getReferenceNumber(), c.getTitle(), c.getDescription(), c.getCategory(), c.getSubCategory(),
            c.getLocationDescription(), c.getStateProvince(), c.getCity(), c.getPincode(), c.getLatitude(), c.getLongitude(),
            c.getAffectedPopulationEstimate(), c.getAffectedPopulationNotes(), c.getUrgency(), c.getExpectedOutcome(),
            c.isConsentGiven(), c.getStatus(), c.getPriority(), c.getSubmittedBy(), c.getSubmittedAt(), c.getVerifiedAt(),
            c.getRejectionReason(), c.getClarificationRequest(), c.isPublic(), c.getCreatedAt(), c.getUpdatedAt(),
            evidence, history, aiAnalysis, validActions
        );
    }
}
