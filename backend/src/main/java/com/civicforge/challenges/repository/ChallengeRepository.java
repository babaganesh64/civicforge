package com.civicforge.challenges.repository;

import com.civicforge.challenges.domain.ChallengePriority;
import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.entity.Challenge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {

    @Query("""
        SELECT c FROM Challenge c
        WHERE (:status IS NULL OR c.status = :status)
        AND (:category IS NULL OR c.category = :category)
        AND (:priority IS NULL OR c.priority = :priority)
        AND (:submittedBy IS NULL OR c.submittedBy = :submittedBy)
        AND (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY c.updatedAt DESC
    """)
    Page<Challenge> findWithFilters(
        @Param("status") ChallengeStatus status,
        @Param("category") String category,
        @Param("priority") ChallengePriority priority,
        @Param("submittedBy") UUID submittedBy,
        @Param("search") String search,
        Pageable pageable
    );

    Page<Challenge> findBySubmittedByOrderByUpdatedAtDesc(UUID submittedBy, Pageable pageable);

    long countByStatus(ChallengeStatus status);

    Optional<Challenge> findByReferenceNumber(String referenceNumber);
}
