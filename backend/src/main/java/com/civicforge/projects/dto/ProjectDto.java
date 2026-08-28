package com.civicforge.projects.dto;

import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProjectDto(
    UUID id,
    @NotNull UUID challengeId,
    @NotNull UUID leadOrganizationId,
    @NotBlank String title,
    String description,
    String status,
    String health,
    LocalDate startDate,
    LocalDate expectedEndDate,
    LocalDate actualEndDate,
    UUID createdBy,
    Instant createdAt,
    Instant updatedAt
) {}
