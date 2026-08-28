package com.civicforge.collaboration.dto;

import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CollaborationRequestDto(
    UUID id,
    UUID challengeId,
    UUID projectId,
    @NotNull UUID requestingOrgId,
    UUID targetOrgId,
    @NotBlank String type,
    String message,
    String status,
    UUID createdBy,
    Instant createdAt,
    Instant updatedAt
) {}
