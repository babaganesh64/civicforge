package com.civicforge.bulk.dto;

import java.time.Instant;
import java.util.UUID;

public record BulkJobResponse(
    UUID id,
    String operationType,
    String status,
    Integer totalItems,
    Integer successCount,
    Integer errorCount,
    Instant requestedAt,
    Instant completedAt
) {}
