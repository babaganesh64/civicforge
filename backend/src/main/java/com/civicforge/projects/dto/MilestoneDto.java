package com.civicforge.projects.dto;

import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MilestoneDto(
    UUID id,
    @NotNull UUID projectId,
    @NotBlank String title,
    String description,
    UUID ownerId,
    LocalDate dueDate,
    String status,
    Integer progressPercent,
    String blockers,
    Instant completedAt,
    Instant createdAt,
    Instant updatedAt
) {}
