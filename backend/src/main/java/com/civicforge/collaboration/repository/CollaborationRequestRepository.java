package com.civicforge.collaboration.repository;

import com.civicforge.collaboration.entity.CollaborationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, UUID> {
    List<CollaborationRequest> findByChallengeId(UUID challengeId);
    List<CollaborationRequest> findByProjectId(UUID projectId);
}
