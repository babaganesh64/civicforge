package com.civicforge.projects.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ImpactMetricDto(
    UUID id,
    @NotNull UUID projectId,
    @NotBlank String metricName,
    BigDecimal metricValue,
    String metricUnit,
    String description,
    UUID recordedBy,
    Instant recordedAt
) {}
