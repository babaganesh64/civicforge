package com.civicforge.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public record AiAnalysisRequest(
        @JsonProperty("challenge_id") UUID challengeId,
        @JsonProperty("title") String title,
        @JsonProperty("description") String description
) {}
