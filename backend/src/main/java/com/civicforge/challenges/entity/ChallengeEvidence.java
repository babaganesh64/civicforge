package com.civicforge.challenges.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "challenge_evidence")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ChallengeEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "challenge_id", nullable = false)
    private UUID challengeId;

    @Column(name = "file_id", nullable = false)
    private UUID fileId;

    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "uploaded_by", nullable = false)
    private UUID uploadedBy;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;

    @PrePersist
    protected void onCreate() {
        if (this.uploadedAt == null) {
            this.uploadedAt = Instant.now();
        }
    }
}
