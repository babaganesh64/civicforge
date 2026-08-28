package com.civicforge.challenges.dto;

import com.civicforge.challenges.domain.ChallengeAction;
import com.civicforge.challenges.domain.ChallengePriority;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ReviewActionRequest(
    @NotNull ChallengeAction action,
    String notes,
    String category,
    ChallengePriority priority,
    UUID assignToOrganizationId
) {}
