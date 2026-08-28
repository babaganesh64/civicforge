package com.civicforge.challenges.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "challenge_ai_analysis")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ChallengeAiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "challenge_id", nullable = false)
    private UUID challengeId;

    @Column(name = "job_id")
    private UUID jobId;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "suggested_category")
    private String suggestedCategory;

    @Column(name = "suggested_priority")
    private String suggestedPriority;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String tags;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "similarity_candidates", columnDefinition = "jsonb")
    private String similarityCandidates;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "suggested_organizations", columnDefinition = "jsonb")
    private String suggestedOrganizations;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore;

    @Column(name = "model_id")
    private String modelId;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "human_override", nullable = false)
    private boolean humanOverride;

    @Column(name = "override_by")
    private UUID overrideBy;

    @Column(name = "override_at")
    private Instant overrideAt;

    @Column(name = "override_notes", columnDefinition = "TEXT")
    private String overrideNotes;

    @Column(name = "triggered_at", nullable = false)
    private Instant triggeredAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_response", columnDefinition = "jsonb")
    private String rawResponse;

    @PrePersist
    protected void onCreate() {
        if (this.triggeredAt == null) {
            this.triggeredAt = Instant.now();
        }
    }
}
