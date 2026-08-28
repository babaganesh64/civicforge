package com.civicforge.challenges.dto;

import com.civicforge.challenges.domain.ChallengePriority;
import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.entity.Challenge;

import java.time.Instant;
import java.util.UUID;

public record ChallengeListItem(
    UUID id,
    String referenceNumber,
    String title,
    String category,
    String stateProvince,
    String city,
    ChallengeStatus status,
    ChallengePriority priority,
    UUID submittedBy,
    Instant submittedAt,
    Instant updatedAt,
    boolean isPublic
) {
    public static ChallengeListItem from(Challenge c) {
        return new ChallengeListItem(
            c.getId(),
            c.getReferenceNumber(),
            c.getTitle(),
            c.getCategory(),
            c.getStateProvince(),
            c.getCity(),
            c.getStatus(),
            c.getPriority(),
            c.getSubmittedBy(),
            c.getSubmittedAt(),
            c.getUpdatedAt(),
            c.isPublic()
        );
    }
}
