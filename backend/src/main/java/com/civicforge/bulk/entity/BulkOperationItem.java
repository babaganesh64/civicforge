package com.civicforge.bulk.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "bulk_operation_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkOperationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "bulk_operation_id", nullable = false)
    private UUID bulkOperationId;

    @Column(name = "resource_id", nullable = false)
    private String resourceId;

    @Column(nullable = false)
    private String status;

    @Column(name = "error_code")
    private String errorCode;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount;

    @Column(name = "processed_at")
    private Instant processedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @PrePersist
    public void prePersist() {
        if (retryCount == null) {
            retryCount = 0;
        }
    }
}
