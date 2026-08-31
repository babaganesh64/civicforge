package com.civicforge.challenges.dto;

import com.civicforge.challenges.domain.ChallengePriority;
import com.civicforge.challenges.domain.ChallengeStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChallengeDetailResponse(
    UUID id,
    String referenceNumber,
    String title,
    String description,
    String category,
    String subCategory,
    String locationDescription,
    String stateProvince,
    String city,
    String pincode,
    BigDecimal latitude,
    BigDecimal longitude,
    Integer affectedPopulationEstimate,
    String affectedPopulationNotes,
    String urgency,
    String expectedOutcome,
    boolean consentGiven,
    ChallengeStatus status,
    ChallengePriority priority,
    UUID submittedBy,
    Instant submittedAt,
    Instant verifiedAt,
    String rejectionReason,
    String clarificationRequest,
    boolean isPublic,
    Instant createdAt,
    Instant updatedAt,
    List<EvidenceItem> evidence,
    List<HistoryItem> history,
    AiAnalysisSummary aiAnalysis,
    List<String> validActions
) {
    public record EvidenceItem(UUID id, UUID fileId, String fileName, String description, Instant uploadedAt) {}
    public record HistoryItem(UUID id, String fromStatus, String toStatus, String action, String actorEmail, String notes, Instant createdAt) {}
    public record AiAnalysisSummary(String status, String suggestedCategory, String suggestedPriority, String summary, String explanation, BigDecimal confidenceScore, boolean humanOverride) {}
}
