package com.civicforge.audit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
@Getter
@Setter
@NoArgsConstructor
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID id;

    @Column(name = "actor_id", updatable = false)
    private String actorId;

    @Column(name = "actor_email", updatable = false)
    private String actorEmail;

    @Column(name = "actor_org_id", updatable = false)
    private String actorOrgId;

    @Column(nullable = false, updatable = false)
    private String action;

    @Column(name = "target_type", nullable = false, updatable = false)
    private String targetType;

    @Column(name = "target_id", nullable = false, updatable = false)
    private String targetId;

    @Column(nullable = false, updatable = false)
    private String result;

    @Column(name = "request_id", updatable = false)
    private String requestId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(columnDefinition = "jsonb", updatable = false)
    private String metadata;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}