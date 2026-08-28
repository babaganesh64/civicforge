package com.civicforge.challenges.repository;

import com.civicforge.challenges.entity.ChallengeAiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChallengeAiAnalysisRepository extends JpaRepository<ChallengeAiAnalysis, UUID> {
    Optional<ChallengeAiAnalysis> findByChallengeId(UUID challengeId);
}
