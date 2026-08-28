package com.civicforge.bulk.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record BulkJobRequest(
    @NotNull String operationType,
    @NotEmpty List<UUID> itemIds,
    Map<String, Object> parameters
) {}
