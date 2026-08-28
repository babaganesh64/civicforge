package com.civicforge.challenges.repository;

import com.civicforge.challenges.entity.ChallengeHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChallengeHistoryRepository extends JpaRepository<ChallengeHistory, UUID> {
    List<ChallengeHistory> findByChallengeIdOrderByCreatedAtAsc(UUID challengeId);
}
