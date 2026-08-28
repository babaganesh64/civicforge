package com.civicforge.collaboration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "collaboration_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "challenge_id")
    private UUID challengeId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "requesting_org_id", nullable = false)
    private UUID requestingOrgId;

    @Column(name = "target_org_id")
    private UUID targetOrgId;

    @Column(nullable = false, length = 50)
    private String type; // INTEREST, OFFER, REQUEST

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 50)
    private String status; // PENDING, ACCEPTED, REJECTED

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
