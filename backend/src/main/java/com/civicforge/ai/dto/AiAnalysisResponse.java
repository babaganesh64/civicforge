package com.civicforge.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record AiAnalysisResponse(
        @JsonProperty("suggested_category") String suggestedCategory,
        @JsonProperty("suggested_priority") String suggestedPriority,
        @JsonProperty("summary") String summary,
        @JsonProperty("tags") List<String> tags,
        @JsonProperty("similarity_candidates") List<Map<String, Object>> similarityCandidates,
        @JsonProperty("suggested_organizations") List<String> suggestedOrganizations,
        @JsonProperty("explanation") String explanation,
        @JsonProperty("confidence_score") BigDecimal confidenceScore,
        @JsonProperty("model_id") String modelId,
        @JsonProperty("model_version") String modelVersion
) {}
