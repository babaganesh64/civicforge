package com.civicforge.projects.dto;

import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DeliverableDto(
    UUID id,
    @NotNull UUID projectId,
    UUID milestoneId,
    @NotBlank String title,
    String description,
    UUID fileId,
    UUID submittedBy,
    String status,
    Instant submittedAt
) {}
