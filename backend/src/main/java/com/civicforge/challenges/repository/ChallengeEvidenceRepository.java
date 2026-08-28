package com.civicforge.challenges.repository;

import com.civicforge.challenges.entity.ChallengeEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChallengeEvidenceRepository extends JpaRepository<ChallengeEvidence, UUID> {
    List<ChallengeEvidence> findByChallengeIdOrderByUploadedAtAsc(UUID challengeId);
}
