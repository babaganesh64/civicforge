package com.civicforge.bulk.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "bulk_operations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "actor_id", nullable = false)
    private UUID actorId;

    @Column(name = "actor_org_id")
    private UUID actorOrgId;

    @Column(nullable = false)
    private String action;

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    @Column(nullable = false)
    private String status;

    @Column(name = "requested_count", nullable = false)
    private Integer requestedCount;

    @Column(name = "processed_count", nullable = false)
    private Integer processedCount;

    @Column(name = "succeeded_count", nullable = false)
    private Integer succeededCount;

    @Column(name = "failed_count", nullable = false)
    private Integer failedCount;

    @Column(name = "skipped_count", nullable = false)
    private Integer skippedCount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> parameters;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "failure_summary", columnDefinition = "jsonb")
    private Map<String, Object> failureSummary;

    @Column(name = "audit_reference")
    private UUID auditReference;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
