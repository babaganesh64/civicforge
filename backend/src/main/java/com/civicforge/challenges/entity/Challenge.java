package com.civicforge.challenges.entity;

import com.civicforge.challenges.domain.ChallengePriority;
import com.civicforge.challenges.domain.ChallengeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import java.util.UUID;
import java.security.SecureRandom;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reference_number", unique = true, nullable = false, updatable = false)
    private String referenceNumber;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(length = 100)
    private String category;

    @Column(name = "sub_category", length = 100)
    private String subCategory;

    @Column(name = "location_description", length = 500)
    private String locationDescription;

    @Column(name = "state_province", length = 100)
    private String stateProvince;

    @Column(length = 100)
    private String city;

    @Column(length = 10)
    private String pincode;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "affected_population_estimate")
    private Integer affectedPopulationEstimate;

    @Column(name = "affected_population_notes", columnDefinition = "TEXT")
    private String affectedPopulationNotes;

    @Column(length = 50)
    private String urgency;

    @Column(name = "expected_outcome", columnDefinition = "TEXT")
    private String expectedOutcome;

    @Column(name = "consent_given", nullable = false)
    private boolean consentGiven;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeStatus status;

    @Enumerated(EnumType.STRING)
    private ChallengePriority priority;

    @Column(name = "submitted_by", nullable = false, updatable = false)
    private UUID submittedBy;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "verified_by")
    private UUID verifiedBy;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "clarification_request", columnDefinition = "TEXT")
    private String clarificationRequest;

    @Column(columnDefinition = "jsonb")
    private String tags;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
        if (this.referenceNumber == null) {
            this.referenceNumber = generateReferenceNumber();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    private String generateReferenceNumber() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[4];
        random.nextBytes(bytes);
        StringBuilder sb = new StringBuilder("CF-");
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
}
