package com.civicforge.challenges.dto;

import com.civicforge.challenges.domain.ChallengePriority;
import com.civicforge.challenges.domain.ChallengeStatus;

import java.util.UUID;

public record ChallengeFilterParams(
    ChallengeStatus status,
    String category,
    ChallengePriority priority,
    String search,
    UUID submittedBy
) {}
