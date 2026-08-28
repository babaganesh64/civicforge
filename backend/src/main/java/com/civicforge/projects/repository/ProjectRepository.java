package com.civicforge.projects.repository;

import com.civicforge.projects.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByChallengeId(UUID challengeId);
    long countByStatus(String status);
}
